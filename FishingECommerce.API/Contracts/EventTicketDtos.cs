namespace FishingECommerce.API.Contracts;

public sealed class SignupTicketDTO
{
    public int RegistrationId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
}

public sealed class MyEventRegistrationDTO
{
    public int RegistrationId { get; set; }
    public FishingEventDTO Event { get; set; } = new();
}
