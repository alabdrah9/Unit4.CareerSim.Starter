import {useContext} from 'react'
import { TokenContext } from './TokenContext.jsx';

export default function useToken() {

  return useContext(TokenContext);
}