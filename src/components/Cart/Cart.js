import React, {useContext, useState} from "react"

import classes from "./Cart.module.css"
import Modal from "../UI/Modal"
import CartItem from "./CartItem"
import CartContext from "../../store/cart-context"
import Checkout from "./Checkout"


const Cart = (props) => {
	const [isCheckout, setIsCheckout] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [didSubmit, setDidSubmit] = useState(false)
	
	const cartCtx = useContext(CartContext)
	
	const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
	const hasItems = cartCtx.items.length > 0;
	
	const cartItemRemoveHandler = (id) => {
		cartCtx.removeItem(id)
	}
	
	const cartItemAddHandler = item => {
		cartCtx.addItem({...item, amount: 1})
	}
	
	const orderHandler = () => {
		setIsCheckout(true)
	}
	
	const submitOrderHandler = async(userData) => {
		setIsSubmitting(true)
		await fetch("https://react-http-c2fbf-default-rtdb.firebaseio.com/orders.json", {
			method: "POST",
			body: JSON.stringify({
				user: userData,
				orderItems: cartCtx.items
			})
		})
		setIsSubmitting(false)
		setDidSubmit(true)
		cartCtx.clearCart()
	}
	
	const cartItems = (<ul className={classes["cart-items"]}>
			{cartCtx.items.map((item) => ( 
			<CartItem
				key={item.id}
				name={item.name}
				amount={item.amount}
				price={item.price}
				onRemove={cartItemRemoveHandler.bind(null, item.id)}
				onAdd={cartItemAddHandler.bind(null, item)}
			/>
			))}
		</ul>);
	
  // const cartItems = (
  //   <ul className={classes['cart-items']}>
  //     {cartCtx.items.map((item) => (
  //       <CartItem
  //         key={item.id}
  //         name={item.name}
  //         amount={item.amount}
  //         price={item.price}
  //         onRemove={cartItemRemoveHandler.bind(null, item.id)}
  //         onAdd={cartItemAddHandler.bind(null, item)}
  //       />
  //     ))}
  //   </ul>
  // );
	
	const cartModalContent = <React.Fragment>
			  {cartItems}
			<div className={classes.total}>
				<span>Total Amount</span>
				<span>{totalAmount}</span>
			</div>
			{isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose}/>}
			{!isCheckout && <div className={classes.actions}>
				<button onClick={props.onClose} className={classes["button--alt"]}>Close</button>
				{hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
			</div>}
		  </React.Fragment>
	
	const isSubmittingModalContent = <p>Sending order data...</p>
	const didSubmitModalContent = <React.Fragment>
			  <p>Succesfully sent the order!</p>
			  <button className={classes.button} onClick={props.onClose}>Close</button>
		  </React.Fragment>
		  
	return(
		<Modal onClose={props.onClose}>
			{!isSubmitting && !didSubmit && cartModalContent}
			{isSubmitting && isSubmittingModalContent}
			{didSubmit && didSubmitModalContent}
		</Modal>
	)
}

export default Cart;