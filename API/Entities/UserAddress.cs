namespace API.Entities
{
    public class UserAddress: Address
    {
        public int Id { get; set; } // this will be a related prop (user and userAddress). To do that, inside the user class I will add a userAddress prop
    }
}