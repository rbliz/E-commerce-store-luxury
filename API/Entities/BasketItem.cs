using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    // because I am sepcifying conventions here, EF will workout the relationships ( in this case, BasketItem - Product)
    // therefore, after doing this I am gonna do the migrations

    [Table("BasketItems")] // using data annotations in the class to specify the table name
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        //adding navigation properties (how to get from the basketitem to the product)

        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int BasketId { get; set; }  //fully defined relationships
        public Basket Basket { get; set; }
    }
}