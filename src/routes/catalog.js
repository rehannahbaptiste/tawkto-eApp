import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Sample data - in production, this would come from a database
const services = [
  { id: 'svc-001', name: 'Passport Renewal' },
  { id: 'svc-002', name: 'Driver\'s Permit Application' },
];

const branches = [
  {
    id: 'br-001',
    name: 'Port of Spain',
    serviceIds: ['svc-001', 'svc-002'],
  },
  {
    id: 'br-002',
    name: 'San Fernando',
    serviceIds: ['svc-001'],
  },
];

// Validation error handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      message: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/services - List available services
router.get('/services', (req, res) => {
  res.json({ services });
});

// GET /api/branches - List available branches
router.get(
  '/branches',
  query('serviceId').optional().isString(),
  handleValidation,
  (req, res) => {
    const { serviceId } = req.query;
    
    let filteredBranches = branches;
    
    if (serviceId) {
      filteredBranches = branches.filter(branch => 
        branch.serviceIds.includes(serviceId)
      );
    }
    
    res.json({ branches: filteredBranches });
  }
);

// POST /api/selections/service - Select a service
router.post(
  '/selections/service',
  body('serviceId').isString().notEmpty(),
  handleValidation,
  (req, res) => {
    const { serviceId } = req.body;
    
    const service = services.find(s => s.id === serviceId);
    
    if (!service) {
      return res.status(404).json({
        code: 'SERVICE_NOT_FOUND',
        message: 'The selected service does not exist.'
      });
    }
    
    const selectionId = generateId('sel');
    
    res.status(201).json({
      selectionId,
      serviceId: service.id,
      links: {
        branches: `/api/branches?serviceId=${service.id}`,
        selectBranch: '/api/selections/branch'
      }
    });
  }
);

// POST /api/selections/branch - Select a branch
router.post(
  '/selections/branch',
  body('serviceId').isString().notEmpty(),
  body('branchId').isString().notEmpty(),
  handleValidation,
  (req, res) => {
    const { serviceId, branchId } = req.body;
    
    const branch = branches.find(b => b.id === branchId);
    
    if (!branch) {
      return res.status(404).json({
        code: 'BRANCH_NOT_FOUND',
        message: 'The selected branch does not exist.'
      });
    }
    
    if (!branch.serviceIds.includes(serviceId)) {
      return res.status(409).json({
        code: 'SERVICE_NOT_AVAILABLE',
        message: 'This branch does not offer the selected service.'
      });
    }
    
    res.status(201).json({
      serviceId,
      branchId: branch.id,
      link: `/appointments/new?serviceId=${serviceId}&branchId=${branch.id}`
    });
  }
);

export default router;
