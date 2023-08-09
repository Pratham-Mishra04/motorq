import getHandler from '@/handlers/getHandler';
import { Workflow } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  workflow: Workflow;
}

interface Count {
  count: number;
}

interface CountView {
  month: Count;
  week: Count;
  day: Count;
}

const initialCount: CountView = {
  month: {
    count: 0,
  },
  week: {
    count: 0,
  },
  day: {
    count: 0,
  },
};

const WorkflowComponent = ({ workflow }: Props) => {
  const [pendingCount, setPendingCount] = useState<Count>({ count: 0 });
  const [acceptedCount, setAcceptedCount] = useState<CountView>(initialCount);
  const [rejectedCount, setRejectedCount] = useState<CountView>(initialCount);

  useEffect(() => {
    getHandler('/admin/get-pending-count/' + workflow.id)
      .then((res) => {
        if (res.statusCode == 200) setPendingCount(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });

    getHandler('/admin/get-approved-count/' + workflow.id)
      .then((res) => {
        if (res.statusCode == 200) setAcceptedCount(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });

    getHandler('/admin/get-rejected-count/' + workflow.id)
      .then((res) => {
        if (res.statusCode == 200) setRejectedCount(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });
  }, []);

  return (
    <div className="flex flex-col bg-white">
      <div className="w-full flex justify-between">
        <div>{workflow.name}</div>
      </div>
      <div className="flex flex-col">
        <div>Description:</div>
        <div>{workflow.description}</div>
      </div>
      <div>Pending Count: {pendingCount.count}</div>
      <div>
        Accepted Count:
        <div>Day-{acceptedCount.day.count}</div>
        <div>Week-{acceptedCount.week.count}</div>
        <div>Month-{acceptedCount.month.count}</div>
      </div>
      <div>
        Rejected Count:
        <div>Day-{rejectedCount.day.count}</div>
        <div>Week-{rejectedCount.week.count}</div>
        <div>Month-{rejectedCount.month.count}</div>
      </div>
    </div>
  );
};

export default WorkflowComponent;
