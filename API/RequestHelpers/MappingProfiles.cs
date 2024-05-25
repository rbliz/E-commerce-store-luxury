using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers
{
    // this automapper package is worth to skip writting all the code we would need to map a DTO.
    public class MappingProfiles: Profile
    {
       public MappingProfiles()
       {
            CreateMap<CreateProductDto, Product>(); // this means I want to go from the productDto, into the Product
            CreateMap<UpdateProductDto, Product>();
       } 
    }
}
