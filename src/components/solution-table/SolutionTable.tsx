import { Solution } from '@/utils/types';
import { Table } from 'antd';
import TableTitle from './TableTitle';
import { formatDate } from '@/utils/dateUtils';

interface SolutionTableProps {
  data: Solution;
}

const SolutionTable = ({ data }: SolutionTableProps) => {
  const fieldNameMapping: Record<string, string> = {
    sugestao_rpa: 'RPA Suggestion',
    localizedMessage: 'Localized Message',
    organizationId: 'Organization ID',
    bauherei: 'Baumuster Error',
    ambiente: 'Environment',
    apiVersion: 'API Version',
    arquivo: 'File',
    baumuster: 'Baumuster',
    configurationDate: 'Configuration Date',
    isValid: 'Validation Status',
    nsrExtension: 'NSR Extension',
    priceType: 'Price Type',
    pricingDate: 'Pricing Date',
    productStructureId: 'Product Structure ID',
    saleSystem: 'Sale System',
  };

  const priorityOrder = [
    'sugestao_rpa',
    'localizedMessage',
    'organizationId',
    'bauherei',
    'ambiente',
    'apiVersion',
  ];

  const dateFields = ['configurationDate', 'pricingDate'];

  const columns = [
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const tableData = Object.entries(data)
    .sort(([keyA], [keyB]) => {
      const indexA = priorityOrder.indexOf(keyA);
      const indexB = priorityOrder.indexOf(keyB);
      return (
        (indexA === -1 ? Infinity : indexA) -
        (indexB === -1 ? Infinity : indexB)
      );
    })
    .filter(([key]) => key !== 'sugestao_rpa')
    .map(([key, value]) => ({
      key,
      field: fieldNameMapping[key] || key.replace(/_/g, ' '),
      value: dateFields.includes(key) ? formatDate(value) : String(value),
    }));

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={false}
      title={() => (
        <TableTitle fieldNameMapping={fieldNameMapping} data={data} />
      )}
      bordered
      size="small"
    />
  );
};

export default SolutionTable;

