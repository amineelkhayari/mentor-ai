using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // ApplicationUser
        CreateMap<ApplicationUser, ApplicationUserDto>().ReverseMap();
        CreateMap<Categorie, CategorieDto>().ReverseMap();
        CreateMap<Formation, FormationDto>().ReverseMap();
        CreateMap<Session, SessionDto>().ReverseMap();

        CreateMap<Formateur, FormateurDto>().ReverseMap();
        CreateMap<UserSession, UserSessionDto>().ReverseMap();

        // Payment
        // CreateMap<Payment, PaymentDto>().ReverseMap()
        //     .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
        //     .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Method.ToString()));

        // Reservation
        // CreateMap<Reservation, ReservationDto>().ReverseMap()
        //     .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));        
    }
}
