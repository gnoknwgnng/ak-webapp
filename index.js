import express from 'express';
import cors from 'cors';
import { WebsiteAnalyzer } from './src/analyzer.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const analyzer = new WebsiteAnalyzer();

app.post('/analyze', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        console.log(`Analyzing website: ${url}`);
        const report = await analyzer.analyzeWebsite(url);

        console.log('Analysis completed successfully');
        console.log('Report structure:', {
            success: report.success,
            hasPerformanceMetrics: !!report.performanceMetrics,
            hasStructuredReport: !!report.structuredReport,
            performanceMetricsKeys: report.performanceMetrics ? Object.keys(report.performanceMetrics) : 'none'
        });

        res.json(report);
    } catch (error) {
        console.error('Analysis error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            error: 'Failed to analyze website',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Website Analyzer running on http://localhost:${PORT}`);
});