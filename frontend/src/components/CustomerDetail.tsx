import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import customer_img from '../assets/customer.png'

interface Customer {
    name: string;
    email: string;
    address: string;
    phone: string;
    createdAt: string;
}

interface CustomerPurchaseLimit {
    spendingLimit: number;
    thresholdLimit: number;
    spendingNotifications: boolean;
}

const CustomerDetails = () => {
    const [customer, setCustomer] = useState<Customer>();
    const [purchaseLimit, setPurchaseLimit] = useState<CustomerPurchaseLimit | null>(null); 
    const [editMode, setEditMode] = useState(false); 
    const [editedPurchaseLimit, setEditedPurchaseLimit] = useState<CustomerPurchaseLimit | null>(null); 

    useEffect(() => {
        fetchCustomerDetails();
        fetchCustomerPurchaseLimit(); 
    }, []);

    const fetchCustomerDetails = async () => {
        try {
            const customerId = '6673d641b5ce57594b4523c2'; 
            const response = await axiosInstance.get<Customer>(`/customers/${customerId}`);
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    const fetchCustomerPurchaseLimit = async () => {
        try {
            const customerId = '6673d641b5ce57594b4523c2'; 
            const response = await axiosInstance.get<CustomerPurchaseLimit>(`/customers/${customerId}/purchase-limit`);
            setPurchaseLimit(response.data);
            setEditedPurchaseLimit(response.data);
        } catch (error) {
            console.error('Error fetching customer purchase limit:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedPurchaseLimit) {
            const { name, value, type, checked } = e.target;
            setEditedPurchaseLimit({
                ...editedPurchaseLimit,
                [name]: type === 'checkbox' ? checked : parseFloat(value)
            });
        }
    };

    const handleSave = async () => {
        try {
            const customerId = '6673d641b5ce57594b4523c2'; 
            if (editedPurchaseLimit) {
                // Check if thresholdLimit is greater than spendingLimit
                if (editedPurchaseLimit.thresholdLimit > editedPurchaseLimit.spendingLimit) {
                    alert('Threshold limit cannot be greater than spending limit. Please adjust.');
                    return; // Prevent further execution
                }
              
                const response = await axiosInstance.put(`/customers/${customerId}/purchase-limit`, editedPurchaseLimit);
                console.log('Response from server:', response.data);
                setPurchaseLimit(editedPurchaseLimit);
                setEditMode(false);
                if (editedPurchaseLimit.spendingNotifications) {
                    alert('You will receive notifications as per your request.');
                    // Optionally, redirect to payment history
                    // history.push('/payment-history');
                }
                alert('Email will be sent if threshold limit is reached.');
                // Optionally, redirect to payment history
                window.location.reload()
            }
        } catch (error) {
            console.error('Error updating customer purchase limit:', error);
        }
    };
    

    const renderCustomerInfo = () => {
        if (!customer) return null;

        return (
            <div className="flex justify-center w-full">
            <div className="flex flex-col md:flex-row justify-around items-center p-8 w-full">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                    <img className="h-48 w-48 object-cover rounded-full shadow-md" src={customer_img} alt="Customer Avatar" />
                </div>
                <div className="p-4 md:p-8 w-full md:w-2/3">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Customer Details</h2>
                    <div className="mb-4 flex flex-col md:flex-row">
                        <span className="text-gray-600 font-semibold w-full md:w-1/3">Name:</span>
                        <span className="text-indigo-500 font-bold w-full md:w-2/3">{customer.name}</span>
                    </div>
                    <div className="mb-4 flex flex-col md:flex-row">
                        <span className="text-gray-600 font-semibold w-full md:w-1/3">Email:</span>
                        <span className="text-gray-500 w-full md:w-2/3">{customer.email}</span>
                    </div>
                    <div className="mb-4 flex flex-col md:flex-row">
                        <span className="text-gray-600 font-semibold w-full md:w-1/3">Phone:</span>
                        <span className="text-gray-500 w-full md:w-2/3">{customer.phone}</span>
                    </div>
                    <div className="mb-4 flex flex-col md:flex-row">
                        <span className="text-gray-600 font-semibold w-full md:w-1/3">Address:</span>
                        <span className="text-gray-500 w-full md:w-2/3">{customer.address}</span>
                    </div>
                    <div className="mb-4 flex flex-col md:flex-row">
                        <span className="text-gray-600 font-semibold w-full md:w-1/3">Joined Us:</span>
                        <span className="text-gray-500 w-full md:w-2/3">{new Date(customer.createdAt).toLocaleDateString()}</span>
                    </div>
                    <br />
                    {purchaseLimit && (
                        <>
                            <div className="flex flex-col md:flex-row md:items-center">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Set a limit</h2>
                                {!editMode && (
                                    <div className="mt-2 md:mt-0 md:ml-10">
                                        <button onClick={() => setEditMode(true)} className="bg-gray-500 text-white px-4 py-2 rounded shadow">
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col md:flex-row">
                                <span className="text-gray-600 font-semibold w-full md:w-1/3">Spending Limit:</span>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="spendingLimit"
                                        value={editedPurchaseLimit?.spendingLimit || ''}
                                        onChange={handleInputChange}
                                        className="text-gray-500 w-full md:w-2/3 border rounded px-2"
                                    />
                                ) : (
                                    <span className="text-gray-500 w-full md:w-2/3">&#8377;{purchaseLimit.spendingLimit.toLocaleString()}</span>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col md:flex-row">
                                <span className="text-gray-600 font-semibold w-full md:w-1/3">Threshold Limit:</span>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="thresholdLimit"
                                        value={editedPurchaseLimit?.thresholdLimit || ''}
                                        onChange={handleInputChange}
                                        className="text-gray-500 w-full md:w-2/3 border rounded px-2"
                                    />
                                ) : (
                                    <span className="text-gray-500 w-full md:w-2/3">&#8377;{purchaseLimit.thresholdLimit.toLocaleString()}</span>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col md:flex-row">
                                <span className="text-gray-600 font-semibold w-full md:w-1/3">Spending Notifications:</span>
                                {editMode ? (
                                    <input
                                        type="checkbox"
                                        name="spendingNotifications"
                                        checked={editedPurchaseLimit?.spendingNotifications || false}
                                        onChange={handleInputChange}
                                        className="w-full md:w-2/3"
                                    />
                                ) : (
                                    <span className="text-gray-500 w-full md:w-2/3">{purchaseLimit.spendingNotifications ? 'Enabled' : 'Disabled'}</span>
                                )}
                            </div>
                            {editMode && (
                                <div className="flex justify-end mt-4">
                                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded shadow">
                                        Save
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
        );
    };

    return (
        <div className="mx-auto mt-2 px-4">
            {renderCustomerInfo()}
        </div>
    );
};

export default CustomerDetails;
