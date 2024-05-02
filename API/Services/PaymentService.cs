using API.Entities;
using Stripe;

// I am creating this as a service in a "service layer" as we are not doing anything here with the db,
// and keeps the code outside the controller, then we can inject it into the controller.

namespace API.Services
{
    public class PaymentService
    {
        // again we need access to the configuration values so we can get the keys
        private readonly IConfiguration _config;

        public PaymentService(IConfiguration config)
        {
            _config = config;
            
        }

        
        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var service = new PaymentIntentService();

            var intent = new PaymentIntent();

            var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
            var deliveryFee = subtotal > 100000? 0: 1000;

            // if there is no payment intent create a new one
            if(string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions 
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string>{"card"} // card as the only method we are going to support in our app
                };

                intent = await service.CreateAsync(options);
           
            }
            // if there is already one, then update it
            else{
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee
                };
                intent = await service.UpdateAsync(basket.PaymentIntentId, options);
            
            }
            return intent;
        }
    }
}