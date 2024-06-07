import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import { createReadStream, promises as fsPromises } from 'fs';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join } from 'path';

const execPromise = promisify(exec);

export const handler = async (event) => {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const s3Bucket = process.env.S3_BUCKET_NAME;
    const now = new Date()
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0') ;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const s3Key = `backup/${year}/${month}/${day}/${hours}-${minutes}-${seconds}/${database}.sql.gz`;

    const dumpFilePath = join(tmpdir(), `${database}.sql.gz`);
    const command = `/opt/bin/mysqldump --single-transaction --skip-lock-tables -h ${host} -u ${user} -p'${password}' ${database} | gzip > ${dumpFilePath}`;

    try {
        await execPromise(command);

        const fileStream = createReadStream(dumpFilePath);
        const s3Client = new S3Client();

        const uploadParams = {
            Bucket: s3Bucket,
            Key: s3Key,
            Body: fileStream
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        console.log(`File uploaded successfully at s3://${s3Bucket}/${s3Key}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `File uploaded successfully at s3://${s3Bucket}/${s3Key}`
            })
        };
    } catch (error) {
        console.error(`Error: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Error: ${error}`
            })
        };
    } finally {
        await fsPromises.unlink(dumpFilePath); // Clean up the temporary file
    }
};
