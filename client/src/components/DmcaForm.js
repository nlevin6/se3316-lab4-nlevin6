import React, { useState } from 'react';

const DmcaForm = ({ onClose, onUpdateDisputes }) => {
    const [formState, setFormState] = useState({
        dateRequestReceived: '',
        dateNoticeSent: '',
        dateDisputeReceived: '',
        notes: '',
        status: 'Active',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/save-dmca-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            if (response.ok) {
                onUpdateDisputes(formState);
                console.log('DMCA form submitted successfully');
            } else {
                console.error('Error submitting DMCA form:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting DMCA form:', error.message);
        }
        onClose();
    };


    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">DMCA Takedown Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="dateRequestReceived">
                        Date Request Received:
                    </label>
                    <input
                        type="date"
                        name="dateRequestReceived"
                        value={formState.dateRequestReceived}
                        onChange={handleChange}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="dateNoticeSent">
                        Date Notice Sent:
                    </label>
                    <input
                        type="date"
                        name="dateNoticeSent"
                        value={formState.dateNoticeSent}
                        onChange={handleChange}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="dateDisputeReceived">
                        Date Dispute Received:
                    </label>
                    <input
                        type="date"
                        name="dateDisputeReceived"
                        value={formState.dateDisputeReceived}
                        onChange={handleChange}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="notes">
                        Notes:
                    </label>
                    <textarea
                        name="notes"
                        value={formState.notes}
                        onChange={handleChange}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="status">
                        Status:
                    </label>
                    <select
                        name="status"
                        value={formState.status}
                        onChange={handleChange}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    >
                        <option value="Active">Active</option>
                        <option value="Processed">Processed</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="bg-gray-400 text-white py-2 px-4 rounded focus:outline-none hover:bg-gray-500"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DmcaForm;
