using System.Collections.Generic;

namespace API.DTOs
{
    // DTO (data transfer object) to extract the properties from the Entities and return with the response
    // we're shaping the data. With this we do not return the Entity
    public class BasketDto
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }

        public List<BasketItemDto> Items { get; set; }

        public string PaymentIntentId { get; set; }

        public string ClientSecret { get; set; }
    }
    
   
}