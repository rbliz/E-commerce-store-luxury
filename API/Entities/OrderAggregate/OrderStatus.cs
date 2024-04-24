namespace API.Entities.OrderAggregate
{

    // here, with the enum, we use a restricted set o values that are human readable
    public enum OrderStatus
    {
        Pending,
        PaymentReceived,
        PaymentFailed

    }
}