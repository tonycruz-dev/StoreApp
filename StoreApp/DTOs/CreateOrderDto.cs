using StoreApp.Entities.OrderAggregate;

namespace StoreApp.DTOs;

public class CreateOrderDto
{
	public required ShippingAddress ShippingAddress { get; set; }
	public required PaymentSummary PaymentSummary { get; set; }
}