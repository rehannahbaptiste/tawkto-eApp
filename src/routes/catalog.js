import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Sample data - in production, this would come from a database
const services = [
  { id: 'svc-001', name: 'Passport Renewal' },
  { id: 'svc-002', name: 'Driver\'s Permit Application' },
  { id: 'svc-003', name: 'Birth Certificate' },
  { id: 'svc-004', name: 'National ID Card' },
];

const branches = [
  {
    id: 'br-001',
    name: 'Port of Spain',
    serviceIds: ['svc-001', 'svc-002', 'svc-003', 'svc-004'],
  },
  {
    id: 'br-002',
    name: 'San Fernando',
    serviceIds: ['svc-001', 'svc-003'],
  },
  {
    id: 'br-003',
    name: 'Chaguanas',
    serviceIds: ['svc-002', 'svc-004'],
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
  query('serviceName').optional().isString(),
  handleValidation,
  (req, res) => {
    const { serviceId, serviceName } = req.query;
    
    let filteredBranches = branches;
    
    // Filter by service name (more natural for users)
    if (serviceName) {
      const service = services.find(s => 
        s.name.toLowerCase() === serviceName.toLowerCase()
      );
      if (service) {
        filteredBranches = branches.filter(branch => 
          branch.serviceIds.includes(service.id)
        );
      }
    }
    // Fallback to serviceId for backward compatibility
    else if (serviceId) {
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
  body('serviceName').optional().isString(),
  body('serviceId').optional().isString(),
  handleValidation,
  (req, res) => {
    const { serviceName, serviceId } = req.body;
    
    if (!serviceName && !serviceId) {
      return res.status(400).json({
        code: 'INVALID_REQUEST',
        message: 'Either serviceName or serviceId is required.'
      });
    }
    
    // Find by name (natural) or ID (fallback)
    let service;
    if (serviceName) {
      service = services.find(s => 
        s.name.toLowerCase() === serviceName.toLowerCase()
      );
    } else {
      service = services.find(s => s.id === serviceId);
    }
    
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
      serviceName: service.name,
      links: {
        branches: `/api/branches?serviceName=${encodeURIComponent(service.name)}`,
        selectBranch: '/api/selections/branch'
      }
    });
  }
);

// POST /api/selections/branch - Select a branch
router.post(
  '/selections/branch',
  body('serviceName').optional().isString(),
  body('serviceId').optional().isString(),
  body('branchName').optional().isString(),
  body('branchId').optional().isString(),
  handleValidation,
  (req, res) => {
    const { serviceName, serviceId, branchName, branchId } = req.body;
    
    // Find service by name or ID
    let service;
    if (serviceName) {
      service = services.find(s => 
        s.name.toLowerCase() === serviceName.toLowerCase()
      );
    } else if (serviceId) {
      service = services.find(s => s.id === serviceId);
    }
    
    if (!service) {
      return res.status(400).json({
        code: 'SERVICE_REQUIRED',
        message: 'Please specify a service (serviceName or serviceId).'
      });
    }
    
    // Find branch by name or ID
    let branch;
    if (branchName) {
      branch = branches.find(b => 
        b.name.toLowerCase() === branchName.toLowerCase()
      );
    } else if (branchId) {
      branch = branches.find(b => b.id === branchId);
    }
    
    if (!branch) {
      return res.status(404).json({
        code: 'BRANCH_NOT_FOUND',
        message: 'The selected branch does not exist.'
      });
    }
    
    if (!branch.serviceIds.includes(service.id)) {
      return res.status(409).json({
        code: 'SERVICE_NOT_AVAILABLE',
        message: 'This branch does not offer the selected service.'
      });
    }
    
    res.status(201).json({
      serviceId: service.id,
      serviceName: service.name,
      branchId: branch.id,
      branchName: branch.name,
      link: `/appointments/new?serviceId=${service.id}&branchId=${branch.id}`
    });
  }
);

export default router;
