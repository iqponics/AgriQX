import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';

interface CustomDatePickerProps {
  dateFormat?: string;
  selected: string | undefined;
  onChange: (date: string) => void;
  placeholderText?: string;
  className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Select Date",
  className = ""
}) => {
  // Utility to parse 'yyyy-mm-dd' string to Date object
  const parseDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    // Month is 0-indexed in JS Date
    return new Date(year, month - 1, day);
  };

  // Utility to format Date object to 'yyyy-mm-dd' string
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={`relative w-full ${className}`}>
      <style>
        {`
          .react-datepicker-wrapper {
            width: 100%;
          }
          .react-datepicker__input-container input {
            width: 100%;
            padding: 0.75rem 0.75rem 0.75rem 3rem; /* pl-12 equivalent */
            background-color: rgb(245 250 245 / 0.5); /* bg-leaf-50/50 */
            border: 1px solid rgb(233 245 233); /* border-leaf-200 */
            border-radius: 0.75rem; /* rounded-xl */
            color: rgb(28 31 35); /* text-charcoal-900 */
            font-weight: 500;
            outline: 2px solid transparent;
            outline-offset: 2px;
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }
           .react-datepicker__input-container input::placeholder {
             color: rgb(156 163 175);
           }
          .react-datepicker__input-container input:focus {
            outline: none;
            --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
            --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) rgb(34 197 94); /* ring-leaf-500 */
            box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
          }
          .react-datepicker {
            border: 1px solid rgb(220 252 231);
            border-radius: 1rem;
            font-family: inherit;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            z-index: 9999;
          }
          .react-datepicker__header {
            background-color: rgb(240 253 244);
            border-bottom: 1px solid rgb(220 252 231);
            padding-top: 1rem;
          }
          .react-datepicker__current-month {
            color: rgb(21 128 61);
            font-weight: 700;
            font-size: 1rem;
            margin-bottom: 0.5rem;
          }
          .react-datepicker__day-name {
            color: rgb(21 128 61);
            font-weight: 600;
          }
          .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
            background-color: rgb(34 197 94) !important;
            color: white !important;
            border-radius: 0.5rem;
          }
          .react-datepicker__day:hover {
            background-color: rgb(220 252 231);
            border-radius: 0.5rem;
          }
          .react-datepicker__navigation-icon::before {
             border-color: rgb(21 128 61);
          }
          
          /* Custom Dropdown Styling */
          .react-datepicker__year-read-view, .react-datepicker__month-read-view, .react-datepicker__month-year-read-view {
              visibility: visible !important;
              color: rgb(21 128 61);
              font-weight: 600;
              border: 1px solid rgb(220 252 231);
              border-radius: 0.5rem;
              padding: 0.25rem 0.5rem;
              margin: 0 0.25rem;
          }
          .react-datepicker__year-read-view:hover, .react-datepicker__month-read-view:hover {
             background-color: rgb(240 253 244);
          }

          .react-datepicker__year-dropdown, .react-datepicker__month-dropdown {
              background-color: white;
              border: 1px solid rgb(220 252 231);
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              width: auto;
              max-height: 250px;
              overflow-y: auto;
          }
          
          .react-datepicker__year-option, .react-datepicker__month-option {
              padding: 0.5rem 1rem;
              color: rgb(55 65 81);
              transition: background-color 0.15s ease;
          }

          /* Hover state for options */
          .react-datepicker__year-option:hover, .react-datepicker__month-option:hover {
              background-color: rgb(240 253 244) !important;
              color: rgb(21 128 61);
          }

          /* Selected option state */
          .react-datepicker__year-option--selected_year, .react-datepicker__month-option--selected_month {
              background-color: rgb(220 252 231) !important;
              color: rgb(21 128 61) !important;
              font-weight: bold;
          }
          
          /* Checkmark removal/styling if present */
          .react-datepicker__year-option--selected_year::before, .react-datepicker__month-option--selected_month::before {
              display: none;
          }

          .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow {
              border-color: rgb(21 128 61);
              top: 5px;
          }
            `}
      </style>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-500 pointer-events-none">
        <Calendar size={18} />
      </div>
      <DatePicker
        selected={parseDate(selected)}
        onChange={(date: Date | null) => onChange(formatDate(date))}
        placeholderText={placeholderText}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        showMonthDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        className="w-full"
      />
    </div>
  );
};

export default CustomDatePicker;
