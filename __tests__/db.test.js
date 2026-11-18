jest.mock('mongoose', () => ({ connection: { readyState: 0 }, connect: jest.fn() }));
const mongoose = require('mongoose');
const connectDB = require('../config/db');
test('concurrent requests share one connection and failed connections can be retried', async () => {
  let resolve;
  mongoose.connect.mockImplementationOnce(() => new Promise(r => { resolve = r; }));
  const first = connectDB('mongodb://example');
  const second = connectDB('mongodb://example');
  expect(mongoose.connect).toHaveBeenCalledTimes(1);
  resolve();
  await Promise.all([first, second]);
  mongoose.connect.mockRejectedValueOnce(new Error('failure'));
  await expect(connectDB('mongodb://example')).rejects.toThrow('failure');
  mongoose.connect.mockResolvedValueOnce();
  await expect(connectDB('mongodb://example')).resolves.toBe(mongoose.connection);
});
