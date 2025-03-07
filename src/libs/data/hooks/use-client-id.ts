import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { LOCAL_STORAGE_CLIENT_ID_KEY } from '../../../constants/config';
import type { DataDispatch } from '../types';

type Params = {
  dispatch: DataDispatch;
};

export const useClientId = ({ dispatch }: Params) => {
  useEffect(() => {
    let clientId = localStorage.getItem(LOCAL_STORAGE_CLIENT_ID_KEY);
    if (!clientId) {
      clientId = uuid();
      localStorage.setItem(LOCAL_STORAGE_CLIENT_ID_KEY, clientId);
    }
    dispatch({
      type: 'updated_client_id',
      clientId,
    });
  }, [dispatch]);
};
