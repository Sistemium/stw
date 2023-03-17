import Model from '@/init/Model';
import Workflow from '@/lib/Workflow';

export default new Model({
  collection: 'StockWithdrawing',
  schema: {
    storageId: String,
  },
  methods: {},
});

export const workflow = new Workflow({
  default: 'progress',
  options: [
    {
      processing: 'planned',
      label: 'workflow.planned',
      options: [{
        to: 'progress',
        label: 'workflow.start',
        type: 'primary',
      }],
      primaryOption: 'progress',
      editable: true,
    },
    {
      processing: 'progress',
      label: 'workflow.progress',
      options: [{
        to: 'finished',
        label: 'workflow.finish',
        type: 'primary',
      }, {
        to: 'planned',
        label: 'workflow.cancel',
        type: 'warning',
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
