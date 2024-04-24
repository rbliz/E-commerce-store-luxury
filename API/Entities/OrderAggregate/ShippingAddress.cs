using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{

    // here I don't need an Id prop because the properties in this entity live in the owner table. The order
    // owns this particular entity

    [Owned]
    public class ShippingAddress : Address
    {
        
    }
}