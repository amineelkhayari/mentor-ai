# --- Stage 1: build Angular client ---
FROM node:20 AS client-build
WORKDIR /src/Client
COPY Client/package*.json ./
RUN npm ci
COPY Client/ ./
RUN npm run build   # outputs to ../deployed/wwwroot per angular.json "tester" config -> /src/deployed/wwwroot

# --- Stage 2: build .NET ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Core/*.csproj Core/
COPY Infrastructure/*.csproj Infrastructure/
COPY API/*.csproj API/
RUN dotnet restore API/API.csproj

COPY Core/ Core/
COPY Infrastructure/ Infrastructure/
COPY API/ API/

# Drop the pre-built Angular output where API expects it, and skip the npm target
COPY --from=client-build /src/deployed/wwwroot ./API/wwwroot

RUN dotnet publish API/API.csproj -c Release -o ./deployed /p:SkipClientBuild=true

# --- Stage 3: runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /src/deployed .

ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "API.dll"]