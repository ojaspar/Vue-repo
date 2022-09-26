import { RequestErrorResponse } from '@/types';

export const ErrorResponse: RequestErrorResponse = {
    404: 'Not Found', //Not Found
    405: 'An error occured. Please try again later or contact the administrator.', //Method Not Allowed
    422: 'An error occured. Please try again later or contact the administrator.', //Method Not Allowed
    500: 'An error occured. Please try again later or contact the administrator.', //Internal Server Error

    //Custom Errors
    600: 'This e-mail is already in use', //Duplicate E-mail
    601: 'No account matches these login credentials', //'Wrong Username',
    602: 'No account matches these login credentials', //'Wrong Password',
    603: 'Field Is Required',
    604: 'Maximum Character Length Exceeded',
    605: 'Invalid Date Format',
    606: 'Invalid Email Address',
    607: 'You have already registered this phone number', //'Duplicate Phone Number',
    608: 'Minimum Character Length Not Exceeded',
    609: 'Invalid Phone Number Format',
    610: 'Invalid Otp',
    611: 'You have exceeded the maximum number of OTP requests. Try again in 24 hours', //OTP Requests Exceeded
    612: 'Recaptcha Token Verification Failed',
    614: 'Email Confirmation Failed',
    615: 'Token Verification Failed',
    616: 'Business Registration Number Is Required',
    617: 'Authentication Failed',
    618: 'Login Failed',
    619: 'User Creation Failed',
    620: 'Invalid Password Reset Token',
    621: 'Password Reset Failed',
    625: 'Cannot Be Less Than Zero',
    626: 'Cannot Be Greater Than Amount',
    627: 'Date Cannot Be Greater Than Today',
    628: 'Date Cannot Be Less Than Today',
    629: 'Invalid Tax Entry',
    630: 'You have not sent a payment to add',
    631: 'Vendor does not exist',
    632: 'Currency Key Do Not Match',
    633: 'Invalid Currency Key',
    634: 'User does not exist',
    635: 'Invalid Loan Date',
    636: 'First Repayment Date Earlier Than Loan Date',
    637: 'InvalidAmount',
    640: 'Cash Account Creation Denied',
    641: 'Insufficient Funds',
    680: 'Data Already Exists',
    681: 'Request failed, try again.',
    690: 'Out of range',
    691: 'Data Not Found',
    692: 'Account Number Already Exist',
    693: 'Source Payment Account Does Not Exist',
};
