using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    //EF will workout the relationships. (Basket - List Items)
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new(); //this initializes a new list when a basket is created

        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }
        
        // I am not doing anything in the Db here. When we call this method we're going to track the basket in memory and update it in memory. 
        //It's only when we save changes to the Db that we actually alter the Db.
        public void AddItem(Product product, int quantity)
        {
            if(Items.All(item=>item.ProductId != product.Id))
            {
                Items.Add(new BasketItem{Product = product, Quantity = quantity});
            }

            var existingItem = Items.FirstOrDefault(item=> item.ProductId == product.Id);
            if(existingItem != null) existingItem.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item=> item.ProductId == productId);
            if(item == null) return;
            item.Quantity -= quantity;
            if(item.Quantity == 0) Items.Remove(item);
        }
    }

   
}