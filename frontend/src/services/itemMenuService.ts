import axios from 'axios';
import { ItemMenuDTO } from '../types/itemMenu';

export const getItemMenusByVendedor = async (vendedorId: number): Promise<ItemMenuDTO[]> => {
	const res = await axios.get(`http://localhost:8080/itemMenu/visualizar/${vendedorId}`);
	return res.data.itemMenus;
};
