import { create } from 'zustand';
import {HOST_ADDRESS} from "@env"

const useStore = create((set) => ({
  hostname: `${HOST_ADDRESS}`,
}));

export default useStore;
