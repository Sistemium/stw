import Model from '@/init/Model';
import Workflow from '@/lib/Workflow';
import type { StockOperation } from '@/models/StockOperations'

export default new Model<StockOperation>({
  collection: 'StockTaking',
  schema: {
    storageId: String,
  },
  methods: {},
});

export const workflow = new Workflow({
  default: 'progress',
  options: [
    {
      processing: 'progress',
      label: 'workflow.progress',
      options: [{
        to: 'finished',
        label: 'workflow.finish',
      }],
      style: 'primary',
      primaryOption: 'finished',
      editable: true,
    },
    {
      processing: 'finished',
      label: 'workflow.finished',
      options: [{
        to: 'progress',
        label: 'workflow.continue',
      }],
      primaryOption: null,
      editable: false,
    },
  ],
});
