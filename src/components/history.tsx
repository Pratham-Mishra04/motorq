import getHandler from '@/handlers/getHandler';
import { Request } from '@/types';
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
    <div className="w-full">
      {requests.map((request) => {
        return (
          <div key={request.id}>
            <div>Name: {request.name}</div>
            <div>Description: {request.description}</div>
            <div>Status: {request.status}</div>
            <div>Requester: {request.Requester.name}</div>
            {/* <div>Workflow: {request.workflow.name}</div> */}
          </div>
        );
      })}
    </div>
  );
};

export default History;
