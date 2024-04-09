import {Link } from "react-router-dom";

export function Navigation(){
    return(
        <ul>
            <li>
        <Link to="/account">Account</Link>
            </li>
            <li>
        <Link to="/">Product</Link>
            </li>
            <li>
        <Link to="/login">Login</Link>
            </li>
            <li>
        <Link to="/register">Register</Link>
            </li>
        </ul>
    )
}