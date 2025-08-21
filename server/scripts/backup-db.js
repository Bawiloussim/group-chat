const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const backupDatabase = async () => {
    try {
        const date = new Date();
        const backupDir = path.join(__dirname, '..', 'backups');
        const backupFile = path.join(backupDir, `backup-${date.toISOString().split('T')[0]}.gz`);
        
        if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        }

        // Commande mongodump (nécessite mongodb-tools installés)
        const command = `mongodump --uri="${process.env.MONGODB_URI}" --archive=${backupFile} --gzip`;
        
        exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Backup failed:', error);
            return;
        }
        console.log('Backup successful:', backupFile);
        
        // Supprimer les sauvegardes de plus de 30 jours
        const files = fs.readdirSync(backupDir);
        files.forEach(file => {
            const filePath = path.join(backupDir, file);
            const stat = fs.statSync(filePath);
            const now = new Date().getTime();
            const endTime = new Date(stat.mtime).getTime() + (30 * 24 * 60 * 60 * 1000);
            
            if (now > endTime) {
            fs.unlinkSync(filePath);
            console.log('Deleted old backup:', filePath);
            }
        });
        });
    } catch (error) {
        console.error('Backup error:', error);
    }
    };

    // Exécuter la sauvegarde si appelé directement
    if (require.main === module) {
    require('dotenv').config({ path: '../backend/.env' });
    backupDatabase();
    }

module.exports = backupDatabase;