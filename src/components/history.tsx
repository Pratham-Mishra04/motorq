import getHandler from '@/handlers/getHandler';
import { Request } from '@/types';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const History = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    getHandler('/admin/get-history')
      .then((res) => {
        if (res.statusCode == 200) {
          setRequests(res.data || []);
        } else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-2xl cursor-pointer">History-</div>
      <div className="flex flex-col gap-2">
        {requests.map((request) => {
          return (
            <div className="flex flex-col gap-2 bg-slate-300 rounded-lg px-2 py-4" key={request.id}>
              <div className="text-2xl">Name: {request.name}</div>
              <div>Description: {request.description}</div>
              <div>Status: {request.status}</div>
              <div>Requester: {request.Requester.name}</div>
              <div>Updated At: {moment(request.updatedAt).format('hh:mm DD MMM YYYY')}</div>
              {/* <div>Workflow: {request.workflow.name}</div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
