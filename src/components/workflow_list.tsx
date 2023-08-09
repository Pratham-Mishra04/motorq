import getHandler from '@/handlers/getHandler';
import { Workflow } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import WorkflowComponent from './workflow';

const WorkflowList = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    getHandler('/admin/get-workflows')
      .then((res) => {
        if (res.statusCode == 200) {
          setWorkflows(res.data || []);
        } else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl cursor-pointer">All WorkFlows-</div>
      <div className="flex flex-col gap-2">
        {workflows.map((workflow) => {
          return <WorkflowComponent key={workflow.id} workflow={workflow} />;
        })}
      </div>
    </div>
  );
};

export default WorkflowList;
