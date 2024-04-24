using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            // because I am using an IQueryable of type Order, the order at this point is the Order, and then
            // to project to an orderDto I will use the Select(...)
            return query
                .Select(order => new OrderDto
                {
                    Id = order.Id,
                    BuyerId = order.BuyerId,
                    ShippingAddress = order.ShippingAddress,
                    OrderDate = order.OrderDate,
                    OrderStatus = order.OrderStatus.ToString(),
                    DeliveryFee = order.DeliveryFee,
                    SubTotal = order.SubTotal,
                    Total = order.GetTotal(),
                    OrderItems = order.OrderItems.Select(item => new OrderItemDto
                    {
                        ProductId = item.ItemOrdered.ProductId,
                        Name = item.ItemOrdered.Name,
                        Price = item.Price,
                        Quantity = item.Quantity,
                        PictureUrl = item.ItemOrdered.PictureUrl,
                    }).ToList()
                }).AsNoTracking(); // since we dont need to have EF tracking this entity and it gave an error in the API when trying to get an order
        }
    }
}
// then I will go to the ordersController to replace the Include() with this method
// and the type returned Order with orderDto