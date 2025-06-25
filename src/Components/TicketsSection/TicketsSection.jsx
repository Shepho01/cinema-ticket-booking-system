import React, { useEffect, useState } from "react";
import "./TicketSection.css";

const ticketTypes = [
  { label: "Adult", price: 22.5 },
  { label: "Student", price: 17.0 },
  { label: "Child", price: 15.0 },
  { label: "Concession", price: 13.0 },
];

const TicketsSection = (props) => {

  const [totalTicketsSelected, setTotalTicketsSelected] = useState(0);

  const [quantities, setQuantities] = useState(
    ticketTypes.map(() => 0)
  );

  useEffect(() => {
    const total = quantities.reduce((acc, qty) => acc + qty, 0);
    setTotalTicketsSelected(total)
    props.setTotalTicketsSelected(total)
  }, [quantities])
  
  const handleQuantityChange = (index, change) => {
    setQuantities((prev) => {
      const total = prev.reduce((acc, qty) => acc + qty, 0);
      const newQty = prev[index] + change;

      if(newQty < 0 || total + change > props.selectedCount) return prev;

      const newQuantities = [...prev];
      newQuantities[index] = newQty;
      return newQuantities;
    });
  }



  const getSubtotal = (index) =>
    (quantities[index] * ticketTypes[index].price).toFixed(2);

  const total = quantities.reduce(
    (acc, qty, idx) => acc + qty * ticketTypes[idx].price,
    0
  ).toFixed(2);

  const bookingFee = (total > 0 ? 1.79 : 0).toFixed(2); 
  const grandTotal = (parseFloat(total) + parseFloat(bookingFee)).toFixed(2);

  return (
    <div className="ticket-table">
      <div className="ticket-header">
        <span>Item</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Subtotal</span>
      </div>

      {ticketTypes.map((ticket, index) => (
        <div key={ticket.label} className="ticket-row">
          <span>{ticket.label}</span>
          <span>${ticket.price.toFixed(2)}</span>
          <span className="quantity-control">
            <button onClick={() => handleQuantityChange(index, -1)}>-</button>
            <input value={quantities[index]} readOnly />
            <button
              onClick={() => handleQuantityChange(index, 1)}
              disabled={totalTicketsSelected >= props.selectedCount}
            >
              +
            </button>
          </span>
          <span>${getSubtotal(index)}</span>
        </div>
      ))}

      <div className="ticket-summary">
        <div>
          <span>SubTotal</span>
          <span>${total}</span>
        </div>
        <div>
          <span>Booking Fee</span>
          <span>${bookingFee}</span>
        </div>
        <div>
          <span>Total</span>
          <span>${grandTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketsSection;
