import React from 'react';
import {format} from 'date-fns';

interface DateTimeProps {
  date: Date;
  dateFormat?: string;
}
const DateTime: React.FC<DateTimeProps> = (
  {
    date,
    dateFormat = 'dd/MM/yyyy - HH:mm'
  }
) => {

  const myDate = new Date(date);
  const formattedDate = format(myDate, dateFormat) || myDate;
  const formatForDateTime = format(myDate, 'yyyy-MM-ddTHH:mm');

  return (
    <time dateTime={formatForDateTime}>
      {formattedDate}
    </time>
  );
};

export default DateTime;
