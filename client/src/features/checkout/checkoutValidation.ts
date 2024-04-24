import * as yup from 'yup';
// for validation I am gonna use a schema validation library >> Yup

// because I need to treat the separate steps of the checkout validation as different forms I will put these
// inside an array. It is then an array of validators even though they will be part of one form
export const validationSchema = [
    // active step 0
    yup.object({
        fullName: yup.string().required('Full name is required'),
        address1: yup.string().required('Address line 1 is required'),
        address2: yup.string().required('Address line 2 is required'),
        city: yup.string().required(),
        state: yup.string().required(),
        zip: yup.string().required(),
        country: yup.string().required(),
    }),
    yup.object(), // this is for the review page (although it does not have inputs required)
    // active step 2
    yup.object({
        nameOnCard: yup.string().required()
    })
]


// then I will go to the checkoutPage to use this in the form hook