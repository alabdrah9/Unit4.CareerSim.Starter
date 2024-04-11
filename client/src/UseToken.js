import {useContext} from 'react'
import { TokenContext } from './TokenContext.jsx';

export default function UseToken() {

  return useContext(TokenContext);
}