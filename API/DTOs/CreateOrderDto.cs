using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class CreateOrderDto
    {
        public bool SaveAddress { get; set; } // to give the user the option to override the address that is related to the user entity

        public ShippingAddress ShippingAddress { get; set; }

    }
}

// this is all we need for the order creation. the basket, the username we'll get them from the API, the server itself...
