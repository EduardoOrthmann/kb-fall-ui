import { Solution } from '@/utils/types';

const TableTitle = ({
  fieldNameMapping,
  data,
}: {
  fieldNameMapping: Record<string, string>;
  data: Solution;
}) => (
  <strong>
    {fieldNameMapping['sugestao_rpa']}: {data['sugestao_rpa']}
  </strong>
);

export default TableTitle;
