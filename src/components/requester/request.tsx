import { Request } from '@/types';
import React from 'react';

interface Props {
  request: Request;
}

const RequestComponent = ({ request }: Props) => {
  return (
    <div className="w-full border-2 flex flex-col gap-1 hover:bg-slate-300 rounded-xl text-center py-2">
      <div className="text-xl border-b-[1px] pb-2">Name: {request.name}</div>
      <div>Description: {request.description}</div>
    </div>
  );
};

export default RequestComponent;
