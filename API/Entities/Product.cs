namespace API.Entities
{
    public class Product
    {
           public int Id { get; set; }        
           public string Name { get; set; }        
           public string Description { get; set; }        
           public long Price { get; set; }        //putting long because on the UI I'll add the decimals ex: 10000 in the dB will be 100.00 dollars
           public string PictureUrl { get; set; }        
           public string Type { get; set; }        
           public string Brand { get; set; }        
           public int QuantityInStock { get; set; }        
    }
}
