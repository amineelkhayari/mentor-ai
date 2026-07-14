using System.Security.Cryptography;
using System.Text;

namespace API.Extensions;

public static class StringExtensions
{
    public static string Hash(this string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return string.Empty;
        }

        using var sha256 = SHA256.Create();
        byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
        var builder = new StringBuilder();

        foreach (var b in bytes)
        {
            builder.Append(b.ToString("x2")); // Converts each byte to a 2-digit hexadecimal string
        }

        return builder.ToString();
    }
}
