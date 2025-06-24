import "./TicketSection.css"

const TicketsSection = (props) => {

    return (<div>
  
        <div className="ticket-section-sub-headings">
            <div>
                <h3>Item</h3>
                <h3>Adult</h3>
                <h3>Student</h3>
                <h3>Child</h3>
                <h3>Concession</h3>
            </div>
            <div>
                <h3>Price</h3>
                <h3>$22.50</h3>
                <h3>$17.00</h3>
                <h3>$15.00</h3>
                <h3>$13.00</h3>
            </div>
            <div>
                <h3>Quantity</h3>
                <h3>0</h3>
                <h3>0</h3>
                <h3>0</h3>
                <h3>0</h3>
            </div>    
            <div>
                <h3>Subtotal</h3>
                <h3>$0</h3>
                <h3>$0</h3>
                <h3>$0</h3>
                <h3>$0</h3>
            </div>
        </div>
        
        <div>SubTotal </div>
        <div>$0.00</div>
        
        <div>Booking Fee </div>
        <div>$0.00</div>

        <div>Total </div>
        <div>$0.00</div>




    </div>);
}

export default TicketsSection