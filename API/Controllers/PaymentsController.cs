using System.Net.Http.Headers;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController: BaseApiController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentService;
        private readonly IConfiguration _config;
       
        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if(basket == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if(intent == null) return BadRequest(new ProblemDetails{Title = "Problem creating payment intent"});

            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;

            if(!result) return BadRequest(new ProblemDetails{Title = "Problem updating basket with intent"});

            return basket.MapBasketToDto();
        }

        [HttpPost("webhook")]

        // inside here we'll need to read the request that stripe is going to send us after a 
        // payment has successfully been received
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            // then we get access to the stripe event we're interested in
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
            _config["StripeSettings:WhSecret"]);

            var charge = (Charge)stripeEvent.Data.Object;
            // now from this charge we want to get access to the paymentIntentId and get hold from
            // the order from our Db that matches the paymentIntentId
            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId); 
            
            if(charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;
            await _context.SaveChangesAsync();

            // this return is to make stripe stop sending events to this endpoint because it thinks there is a problem
            // with us receiving its request.
            return new EmptyResult(); 
        }
    }
    // If this works it will return a 200 OK response with the basket inside there.
    
    // we are not gonna be out to get a payment intent directly from stripe using our API and create a route
    // for that...
    // we are not following REST specifications strictly to the line, in the way that we would then have to
    // return a 201 created with the request so we can go and get the resource we've created...
    
}