import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import Skeleton from 'react-loading-skeleton';
import Select  from 'react-select';


function FormField({ label, type, placeholder, id, onChange, name, value, disabled = false,loading=false, required=true, options,maxLength , as, rows}) {
  
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const getFormattedPastDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#CAA257' : 'transparent', 
      '&:hover': {
        backgroundColor: '#CAA257', 
      },
    }),
 
  };
  
  return (
    <Form.Group  className="mb-3 " controlId={id} >

      <Form.Label className='fw-bold' style={{ fontSize: '0.8rem' }}>{label} {required?<span style={{color:'rgba(217, 64, 4, 1)'}}>*</span>:''}</Form.Label>


      {
      loading?
      <Skeleton height={'2rem'} />
      :
      type === 'select' ? (
        
        <Select
        className="form-fid"
        name={name}
      
        value={options.find(option => option.label === value) || null}
        options={options}
        isSearchable
        onChange={(selectedOption) => onChange({ 
          target: {
            name,
            value: selectedOption ? selectedOption.value : '',
            label: selectedOption ? selectedOption.label : '',  
          } 
        }
        
          )
        
        }
        isDisabled={disabled}
        placeholder={placeholder}
        required={required}
        styles={customStyles}
      />
        // <Form.Select  className="form-field text-white " name={name} value={value} onChange={onChange} disabled={disabled} >
        //   {options.map((option, index) => (
        //     <option key={option.value} value={option.value}  className='bg-dark'>
        //       {option.label}
        //     </option>
        //   ))}
        // </Form.Select>
      )
      :      
      type === 'password' ?
      (
      <InputGroup className=''>
        <Form.Control
          className={' form-field text-white'}
          required={required}
          type={showPassword ? 'text' : 'password'}
          aria-label={showPassword ? 'Show password' : 'Hide password'}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
         
        />
        <Button variant="transparent" className='form-field'  onClick={togglePasswordVisibility}>
          {showPassword ? <HiOutlineEye color='rgba(150, 150, 150, 1)' />: <HiOutlineEyeOff color='rgba(150, 150, 150, 1)' /> }
        </Button>
      </InputGroup>
      ):
      type === 'tel' ? (
        <Form.Control
          className={'form-field text-white '}
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={(e) => {
            const inputValue = e.target.value;
            const isValidNumber = /^-?\d*\.?\d*$/.test(inputValue);
      
            if (isValidNumber) {
              onChange({ target: { name, value: inputValue } });
            }
          }}
          pattern="[-]?\d*\.?\d+"
          disabled={disabled}
        />
      )

      :(
        <Form.Control
          className={'form-field text-white '}
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          as={as}
          rows={rows}
          onChange={onChange}
          disabled={disabled}
          max={type === 'date' ? getFormattedPastDate() : null}
          maxLength={maxLength}
        />
      )
      
    }

    </Form.Group>
  );
}

export default FormField;
