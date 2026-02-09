using AutoMapper;
using StoreApp.DTOs;
using StoreApp.Entities;

namespace StoreApp.RequestHelpers;

public class MappingProfiles : Profile
{
	public MappingProfiles()
	{
		CreateMap<CreateProductDto, Product>();
		CreateMap<UpdateProductDto, Product>();
	}
}
