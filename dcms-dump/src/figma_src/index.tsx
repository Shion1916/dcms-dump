/*import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS for all routes
app.use('*', cors({
  origin: '*',
  allowHeaders: [
    '*'
  ],
  allowMethods: [
    '*'
  ]
}));

// Add logging
app.use('*', logger(console.log));

// Initialize demo data
async function initializeDemoData() {
  try {
    console.log('Checking for existing demo data...');
    // Always try to recreate demo data to ensure it's fresh
    const allUsers = await kv.getByPrefix('dcms:user:');
    console.log('Current users in database:', allUsers.length);
    console.log('Creating/updating demo data...');
    // Create demo users
    const demoUsers = [
      {
        email: 'admin@localhost',
        user: {
          id: 'admin-1',
          email: 'admin@localhost',
          password: 'c1$Vg4unme',
          first_name: 'System',
          last_name: 'Administrator',
          name: 'System Administrator',
          role: 'admin',
          canLogin: true,
          registrationType: 'registered',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        }
      },
      {
        email: 'dentist@dentalclinic.com',
        user: {
          id: 'dentist-1',
          email: 'dentist@dentalclinic.com',
          password: 'password123',
          first_name: 'Sarah',
          last_name: 'Johnson',
          name: 'Dr. Sarah Johnson',
          role: 'dentist',
          canLogin: true,
          registrationType: 'registered',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        }
      },
      {
        email: 'staff@dentalclinic.com',
        user: {
          id: 'staff-1',
          email: 'staff@dentalclinic.com',
          password: 'password123',
          first_name: 'Mary',
          last_name: 'Chen',
          name: 'Mary Chen',
          role: 'staff',
          canLogin: true,
          registrationType: 'registered',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        }
      },
      {
        email: 'patient@example.com',
        user: {
          id: 'patient-1',
          email: 'patient@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Smith',
          name: 'John Smith',
          phone: '(555) 123-4567',
          role: 'patient',
          canLogin: true,
          registrationType: 'registered',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        }
      },
      // Add some anonymous patients for demo
      {
        email: 'jane@example.com',
        user: {
          id: 'patient-2',
          email: 'jane@example.com',
          password: null,
          first_name: 'Jane',
          last_name: 'Doe',
          name: 'Jane Doe',
          phone: '(555) 987-6543',
          role: 'patient',
          canLogin: false,
          registrationType: 'anonymous',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        }
      },
      {
        email: 'mike@example.com',
        user: {
          id: 'patient-3',
          email: 'mike@example.com',
          password: null,
          first_name: 'Mike',
          last_name: 'Johnson',
          name: 'Mike Johnson',
          phone: '(555) 456-7890',
          role: 'patient',
          canLogin: false,
          registrationType: 'anonymous',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        }
      }
    ];
    // Create demo users
    for (const { email, user } of demoUsers){
      await kv.set(`dcms:user:${email}`, user);
      console.log(`Created user: ${email} (${user.role})`);
    }
    // Create demo appointments with confirmed date/time data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    
    const demoAppointments = [
      {
        id: "9f41f0bb-50d1-4933-b350-8a29e2b4e221",
        patientName: "John Smith",
        patientEmail: "patient@example.com",
        patientPhone: "(555) 123-4567",
        reason: "Routine checkup and cleaning",
        requestedDate: tomorrow.toISOString().split("T")[0],
        requestedTimeSlot: "10:00-11:15",
        date: tomorrow.toISOString().split("T")[0],
        time: "10:00",
        serviceDuration: 60,
        bufferTime: 15,
        dentistName: "Dr. Sarah Johnson",
        status: "booked",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_1",
            name: "Routine Cleaning",
            duration: 60,
            buffer: 15,
            base_price: 120,
            description: "Comprehensive dental cleaning and oral health examination with plaque and tartar removal"
          }
        ]
      },
      {
        id: "b1922b68-39d7-4f36-9e58-86d7c9e0e1f7",
        patientName: "Jane Doe",
        patientEmail: "jane@example.com",
        patientPhone: "(555) 987-6543",
        reason: "Dental filling",
        requestedDate: dayAfter.toISOString().split("T")[0],
        requestedTimeSlot: "14:00-15:00",
        date: dayAfter.toISOString().split("T")[0],
        time: "14:00",
        serviceDuration: 45,
        bufferTime: 15,
        dentistName: "Dr. Michael Chen",
        status: "booked",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_2",
            name: "Dental Filling",
            duration: 45,
            buffer: 15,
            base_price: 180,
            description: "Composite or amalgam filling for cavity restoration"
          }
        ]
      },
      {
        id: "c8a8507e-95c5-41d8-b91b-4a2ac09d56d9",
        patientName: "Mike Johnson",
        patientEmail: "mike@example.com",
        patientPhone: "(555) 456-7890",
        reason: "Teeth whitening",
        requestedDate: tomorrow.toISOString().split("T")[0],
        requestedTimeSlot: "13:30-14:45",
        date: tomorrow.toISOString().split("T")[0],
        time: "13:30",
        serviceDuration: 60,
        bufferTime: 15,
        dentistName: "Dr. Sarah Johnson",
        status: "booked",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_4",
            name: "Teeth Whitening",
            duration: 75,
            buffer: 15,
            base_price: 350,
            description: "Professional teeth whitening treatment for brighter smile"
          }
        ]
      },
      {
        id: "4fdb23af-2b68-492f-9c57-79c3447e86f2",
        patientName: "Sarah Wilson",
        patientEmail: "sarah@example.com",
        patientPhone: "(555) 234-5678",
        reason: "Emergency tooth pain",
        requestedDate: today.toISOString().split("T")[0],
        requestedTimeSlot: "09:00-10:00",
        date: today.toISOString().split("T")[0],
        time: "09:00",
        dentistName: "Dr. Emily Rodriguez",
        status: "cancelled",
        cancellationReason: "no-show",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_5",
            name: "Tooth Extraction",
            duration: 30,
            buffer: 20,
            base_price: 250,
            description: "Surgical or simple removal of damaged or problematic teeth"
          }
        ]
      },
      {
        id: "e97c3790-76d0-4c7c-9a25-9ac3a7a37d88",
        patientName: "Robert Brown",
        patientEmail: "robert@example.com",
        patientPhone: "(555) 345-6789",
        reason: "Dental crown fitting",
        requestedDate: dayAfter.toISOString().split("T")[0],
        requestedTimeSlot: "15:30-16:30",
        date: dayAfter.toISOString().split("T")[0],
        time: "15:30",
        dentistName: "Dr. David Kim",
        status: "cancelled",
        cancellationReason: "patient-cancelled",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_6",
            name: "Dental Crown",
            duration: 120,
            buffer: 30,
            base_price: 950,
            description: "Custom-made crown to restore damaged tooth structure and function"
          }
        ]
      },
      {
        id: "f5a9c4b3-0dc4-4ff1-81e2-ec08c8eb2a4a",
        patientName: "Lisa Garcia",
        patientEmail: "lisa@example.com",
        patientPhone: "(555) 456-7890",
        reason: "Routine cleaning",
        requestedDate: today.toISOString().split("T")[0],
        requestedTimeSlot: "11:00-12:00",
        date: today.toISOString().split("T")[0],
        time: "11:00",
        dentistName: "Dr. Sarah Johnson",
        status: "completed",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_1",
            name: "Routine Cleaning",
            duration: 60,
            buffer: 15,
            base_price: 120,
            description: "Comprehensive dental cleaning and oral health examination with plaque and tartar removal"
          }
        ]
      },
      {
        id: "2a497fc0-0c90-4703-bec3-5d746a9dcff2",
        patientName: "Michael Brown",
        patientEmail: "michael@example.com",
        patientPhone: "(555) 789-0123",
        reason: "Dental filling",
        requestedDate: today.toISOString().split("T")[0],
        requestedTimeSlot: "14:00-15:00",
        date: today.toISOString().split("T")[0],
        time: "14:00",
        dentistName: "Dr. Sarah Johnson",
        status: "completed",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_2",
            name: "Dental Filling",
            duration: 45,
            buffer: 15,
            base_price: 180,
            description: "Composite or amalgam filling for cavity restoration"
          }
        ]
      },
      {
        id: "8d3f4f91-fbd7-4786-a415-83d63f02fef0",
        patientName: "Emily Davis",
        patientEmail: "emily@example.com",
        patientPhone: "(555) 234-5678",
        reason: "Teeth whitening",
        requestedDate: today.toISOString().split("T")[0],
        requestedTimeSlot: "16:00-17:00",
        date: today.toISOString().split("T")[0],
        time: "16:00",
        dentistName: "Dr. Michael Chen",
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        serviceDetails: [
          {
            id: "sc_4",
            name: "Teeth Whitening",
            duration: 75,
            buffer: 15,
            base_price: 350,
            description: "Professional teeth whitening treatment for brighter smile"
          }
        ]
      }
    ];

    // Create demo appointments
    for (const appointment of demoAppointments) {
      await kv.set(`dcms:appointment:${appointment.id}`, appointment);
      console.log(`Created appointment: ${appointment.id} for ${appointment.patientName} on ${appointment.requestedDate || 'pending'}`);
    }
    
    // Set up patient appointment associations
    await kv.set('dcms:user-appointments:patient@example.com', ['apt-demo-1']);
    await kv.set('dcms:user-appointments:jane@example.com', ['apt-demo-2']);
    await kv.set('dcms:user-appointments:mike@example.com', ['apt-demo-3']);
    // Create demo services catalog
    const demoServices = [
      {
        id: 'sc_1',
        name: 'Routine Cleaning',
        description: 'Comprehensive dental cleaning and oral health examination with plaque and tartar removal',
        base_price: 120,
        has_treatment_detail: false,
        estimated_duration: 60,
        buffer_time: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_2',
        name: 'Dental Filling',
        description: 'Composite or amalgam filling for cavity restoration',
        base_price: 180,
        has_treatment_detail: true,
        estimated_duration: 45,
        buffer_time: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_3',
        name: 'Root Canal Treatment',
        description: 'Endodontic therapy to treat infected or severely decayed teeth',
        base_price: 800,
        has_treatment_detail: true,
        estimated_duration: 90,
        buffer_time: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_4',
        name: 'Teeth Whitening',
        description: 'Professional teeth whitening treatment for brighter smile',
        base_price: 350,
        has_treatment_detail: false,
        estimated_duration: 75,
        buffer_time: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_5',
        name: 'Tooth Extraction',
        description: 'Surgical or simple removal of damaged or problematic teeth',
        base_price: 250,
        has_treatment_detail: true,
        estimated_duration: 30,
        buffer_time: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_6',
        name: 'Dental Crown',
        description: 'Custom-made crown to restore damaged tooth structure and function',
        base_price: 950,
        has_treatment_detail: true,
        estimated_duration: 120,
        buffer_time: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_7',
        name: 'Orthodontic Consultation',
        description: 'Initial consultation and assessment for braces or clear aligners',
        base_price: 150,
        has_treatment_detail: false,
        estimated_duration: 45,
        buffer_time: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_8',
        name: 'Dental Bridge',
        description: 'Fixed prosthetic device to replace one or more missing teeth',
        base_price: 1200,
        has_treatment_detail: true,
        estimated_duration: 150,
        buffer_time: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_9',
        name: 'Periodontal Treatment',
        description: 'Deep cleaning and treatment for gum disease and periodontal issues',
        base_price: 300,
        has_treatment_detail: true,
        estimated_duration: 90,
        buffer_time: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sc_10',
        name: 'Dental Implant',
        description: 'Permanent tooth replacement with titanium implant and crown',
        base_price: 2500,
        has_treatment_detail: true,
        estimated_duration: 180,
        buffer_time: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const service of demoServices) {
      await kv.set(`dcms:service-catalog:${service.id}`, service);
      console.log(`Created service: ${service.name} (${service.base_price})`);
    }

    // Create demo bills
    const demoBills = [
      {
        id: 'bill-demo-1',
        appointmentId: 'apt-demo-6', // Lisa Garcia's completed appointment
        patientId: 'patient-demo-1',
        patientName: 'Lisa Garcia',
        patientEmail: 'lisa@example.com',
        patientPhone: '(555) 456-7890',
        items: [
          {
            id: 'item-1',
            serviceId: 'sc_1',
            serviceName: 'Routine Cleaning',
            description: 'Comprehensive dental cleaning and oral health examination',
            quantity: 1,
            unitPrice: 120,
            subtotal: 120
          }
        ],
        totalAmount: 120,
        paidAmount: 120,
        outstandingBalance: 0,
        paymentMethod: 'cash',
        status: 'paid',
        notes: 'Payment received in full',
        createdBy: 'staff@dentalclinic.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'bill-demo-2',
        appointmentId: 'apt-demo-7',
        patientId: 'patient-demo-2',
        patientName: 'Michael Brown',
        patientEmail: 'michael@example.com',
        patientPhone: '(555) 123-4567',
        items: [
          {
            id: 'item-2',
            serviceId: 'sc_2',
            serviceName: 'Dental Filling',
            description: 'Composite filling for cavity restoration',
            quantity: 1,
            unitPrice: 180,
            subtotal: 180
          }
        ],
        totalAmount: 180,
        paidAmount: 100,
        outstandingBalance: 80,
        paymentMethod: 'card',
        status: 'partial',
        notes: 'Partial payment received, balance due',
        createdBy: 'staff@dentalclinic.com',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'bill-demo-3',
        appointmentId: 'apt-demo-8',
        patientId: 'patient-demo-3',
        patientName: 'Emily Davis',
        patientEmail: 'emily@example.com',
        patientPhone: '(555) 234-5678',
        items: [
          {
            id: 'item-3',
            serviceId: 'sc_4',
            serviceName: 'Teeth Whitening',
            description: 'Professional teeth whitening treatment',
            quantity: 1,
            unitPrice: 350,
            subtotal: 350
          }
        ],
        totalAmount: 350,
        paidAmount: 0,
        outstandingBalance: 350,
        status: 'pending',
        notes: 'Bill generated, payment pending',
        createdBy: 'staff@dentalclinic.com',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const bill of demoBills) {
      await kv.set(`dcms:bill:${bill.id}`, bill);
      console.log(`Created bill: ${bill.id} for ${bill.patientName} (${bill.status})`);
    }

    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
}

// Initialize demo data on startup (don't let failures crash the function)
initializeDemoData().catch((error)=>{
  console.error('Failed to initialize demo data - function will continue:', error);
});

// Simple test endpoint (no database calls)
app.get('/make-server-c89a26e4/test', (c)=>{
  return c.json({
    status: 'working',
    timestamp: new Date().toISOString(),
    message: 'Function deployed successfully'
  });
});

// Server status and timestamp endpoint  
app.get('/make-server-c89a26e4/server-status', (c)=>{
  return c.json({
    status: 'active',
    timestamp: new Date().toISOString(),
    version: 'v2.1-merienda-debug',
    message: 'Server function is running with enhanced merienda break debugging',
    breakTimes: [
      { start: '12:00', end: '13:00', name: 'Lunch Break' },
      { start: '15:00', end: '15:15', name: 'Merienda' }
    ]
  });
});

// Merienda break test endpoint
app.get('/make-server-c89a26e4/test-merienda', (c)=>{
  try {
    // Test the merienda break logic with a fixed example
    const serviceDuration = 60;
    const bufferTime = 15;
    const totalServiceTime = serviceDuration + bufferTime; // 75 minutes
    
    // Define break times (same as in available-slots)
    const breakTimes = [
      { start: '12:00', end: '13:00', name: 'Lunch Break' },
      { start: '15:00', end: '15:15', name: 'Merienda' }
    ];
    
    // Convert break times to minutes
    const breakTimesParsed = breakTimes.map(breakTime => ({
      startMinutes: parseInt(breakTime.start.split(':')[0]) * 60 + parseInt(breakTime.start.split(':')[1]),
      endMinutes: parseInt(breakTime.end.split(':')[0]) * 60 + parseInt(breakTime.end.split(':')[1]),
      name: breakTime.name
    }));
    
    // Test specific slots that should be blocked by merienda
    const testSlots = [
      '13:45', // Should NOT conflict (ends at 15:00)
      '14:00', // Should conflict (ends at 15:15)  
      '14:15', // Should conflict (ends at 15:30)
      '14:30', // Should conflict (ends at 15:45)
      '15:00', // Should conflict (starts during break)
      '15:15', // Should NOT conflict (starts after break)
      '15:30'  // Should NOT conflict
    ];
    
    const results = testSlots.map(timeSlot => {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const startMinutes = hour * 60 + minute;
      const endMinutes = startMinutes + totalServiceTime;
      
      let conflicts = false;
      let conflictReason = '';
      
      // Check against merienda break specifically (900-915 minutes)
      const meriendaBreak = breakTimesParsed.find(b => b.name === 'Merienda');
      if (meriendaBreak && startMinutes < meriendaBreak.endMinutes && endMinutes > meriendaBreak.startMinutes) {
        conflicts = true;
        conflictReason = `Conflicts with Merienda (${startMinutes}-${endMinutes} vs ${meriendaBreak.startMinutes}-${meriendaBreak.endMinutes})`;
      }
      
      return {
        time: timeSlot,
        startMinutes,
        endMinutes,
        conflicts,
        conflictReason: conflictReason || 'No conflict',
        expected: timeSlot >= '14:00' && timeSlot <= '15:00' // Expected to conflict
      };
    });
    
    return c.json({
      status: 'merienda-test-complete',
      timestamp: new Date().toISOString(),
      serviceConfig: {
        serviceDuration,
        bufferTime,
        totalServiceTime
      },
      breakTimes: breakTimesParsed,
      results,
      summary: {
        totalTested: results.length,
        conflictsFound: results.filter(r => r.conflicts).length,
        expectedConflicts: results.filter(r => r.expected).length,
        correctResults: results.filter(r => r.conflicts === r.expected).length
      }
    });
  } catch (error) {
    return c.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Health check endpoint
// Services catalog endpoints
app.get('/make-server-c89a26e4/services-catalog', async (c)=>{
  try {
    const allServices = await kv.getByPrefix('dcms:service-catalog:');
    return c.json({
      services: allServices
    });
  } catch (error) {
    console.log('Get services catalog error:', error);
    return c.json({
      error: 'Failed to fetch services catalog'
    }, 500);
  }
});

// Patients endpoint - get all patients for staff/admin
app.get('/make-server-c89a26e4/patients', async (c) => {
  try {
    const allUsers = await kv.getByPrefix('dcms:user:');
    const patients = allUsers
      .filter(user => user.role === 'patient')
      .map(user => {
        // Add computed name field for backward compatibility
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        const patientWithName = {
          ...user,
          name: user.name || fullName || user.email
        };
        return patientWithName;
      });

    return c.json({
      patients
    });
  } catch (error) {
    console.log('Get patients error:', error);
    return c.json({
      error: 'Failed to fetch patients'
    }, 500);
  }
});

// Walk-in patient creation endpoint
app.post('/make-server-c89a26e4/walk-in-patient', async (c) => {
  try {
    const { name, phone, email, staffEmail } = await c.req.json();
    
    if (!name || !email || !staffEmail) {
      return c.json({
        error: 'Name, email, and staff email are required'
      }, 400);
    }

    // Check if patient already exists
    const existingUser = await kv.get(`dcms:user:${email}`);
    if (existingUser) {
      return c.json({
        error: 'A patient with this email already exists'
      }, 409);
    }

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create walk-in patient
    const patientId = `patient-${crypto.randomUUID()}`;
    const patient = {
      id: patientId,
      email,
      first_name: firstName,
      last_name: lastName,
      name,
      phone: phone || null,
      role: 'patient',
      canLogin: false,
      password: null,
      registrationType: 'anonymous',
      isWalkIn: true,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      createdBy: staffEmail
    };

    await kv.set(`dcms:user:${email}`, patient);
    console.log(`Created walk-in patient: ${email} by staff: ${staffEmail}`);

    return c.json({
      patient
    });
  } catch (error) {
    console.log('Create walk-in patient error:', error);
    return c.json({
      error: 'Failed to create walk-in patient'
    }, 500);
  }
});

// Profile update endpoint
app.put('/make-server-c89a26e4/profile/:email', async (c) => {
  try {
    const email = c.req.param('email');
    const updates = await c.req.json();
    
    const existingUser = await kv.get(`dcms:user:${email}`);
    if (!existingUser) {
      return c.json({
        error: 'User not found'
      }, 404);
    }

    const updatedUser = {
      ...existingUser,
      ...updates,
      lastUpdatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:user:${email}`, updatedUser);

    return c.json({
      user: updatedUser
    });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({
      error: 'Failed to update profile'
    }, 500);
  }
});

// Patient validation endpoint
app.post('/make-server-c89a26e4/patients/validate', async (c) => {
  try {
    const { email, firstName, lastName, phone } = await c.req.json();
    
    if (!email) {
      return c.json({
        error: 'Email is required'
      }, 400);
    }

    // Check if user exists by email
    const existingUser = await kv.get(`dcms:user:${email}`);
    
    if (!existingUser) {
      // User doesn't exist - can proceed with booking (user will be created during booking)
      return c.json({
        canBook: true,
        hasOutstandingBalance: false,
        existingUser: null,
        message: 'New patient - ready to book'
      });
    }

    // User exists - check if they can login (registered user)
    if (existingUser.canLogin) {
      return c.json({
        canBook: false,
        hasOutstandingBalance: false,
        existingUser,
        message: 'This email is already registered. Please log in to continue.'
      });
    }

    // Check for outstanding balances
    const allBills = await kv.getByPrefix('dcms:bill:');
    const userBills = allBills.filter(bill => 
      bill.patientEmail === email && bill.outstandingBalance > 0
    );
    
    const totalOutstanding = userBills.reduce((sum, bill) => sum + bill.outstandingBalance, 0);
    
    if (totalOutstanding > 0) {
      return c.json({
        canBook: false,
        hasOutstandingBalance: true,
        outstandingAmount: totalOutstanding,
        existingUser,
        message: `Outstanding balance of ₱${totalOutstanding.toLocaleString()}`
      });
    }

    // Check if data matches existing record
    const dataMatches = 
      existingUser.first_name === firstName &&
      existingUser.last_name === lastName &&
      (existingUser.phone === phone || (!existingUser.phone && !phone));

    if (!dataMatches) {
      // Data doesn't match - use existing data
      return c.json({
        canBook: true,
        hasOutstandingBalance: false,
        existingUser,
        shouldUseExistingData: true,
        message: 'We found an existing patient record for this email. Booking will proceed under that record.'
      });
    }

    // Everything matches - proceed with booking
    return c.json({
      canBook: true,
      hasOutstandingBalance: false,
      existingUser,
      message: 'Patient validated successfully'
    });

  } catch (error) {
    console.log('Patient validation error:', error);
    return c.json({
      error: 'Failed to validate patient'
    }, 500);
  }
});

// Medical Records Endpoints
app.get('/make-server-c89a26e4/medical-records/:patientEmail', async (c) => {
  try {
    const patientEmail = c.req.param('patientEmail');
    
    // Get all medical records for this patient
    const allMedicalRecords = await kv.getByPrefix(`dcms:medical-record:`);
    const patientRecords = allMedicalRecords.filter(record => 
      record.patientEmail === patientEmail && record.isActive
    );

    // Group records by type
    const medicalInfo = patientRecords.filter(r => r.type === 'medical_info');
    const allergies = patientRecords.filter(r => r.type === 'allergy');
    const medications = patientRecords.filter(r => r.type === 'medication');

    return c.json({
      medicalInfo,
      allergies,
      medications
    });
  } catch (error) {
    console.log('Get medical records error:', error);
    return c.json({
      error: 'Failed to fetch medical records'
    }, 500);
  }
});

app.post('/make-server-c89a26e4/medical-records', async (c) => {
  try {
    const recordData = await c.req.json();
    const recordId = `record-${crypto.randomUUID()}`;
    
    const medicalRecord = {
      id: recordId,
      ...recordData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:medical-record:${recordId}`, medicalRecord);

    return c.json({
      record: medicalRecord
    });
  } catch (error) {
    console.log('Create medical record error:', error);
    return c.json({
      error: 'Failed to create medical record'
    }, 500);
  }
});

app.put('/make-server-c89a26e4/medical-records/:id', async (c) => {
  try {
    const recordId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingRecord = await kv.get(`dcms:medical-record:${recordId}`);
    if (!existingRecord) {
      return c.json({
        error: 'Medical record not found'
      }, 404);
    }

    const updatedRecord = {
      ...existingRecord,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:medical-record:${recordId}`, updatedRecord);

    return c.json({
      record: updatedRecord
    });
  } catch (error) {
    console.log('Update medical record error:', error);
    return c.json({
      error: 'Failed to update medical record'
    }, 500);
  }
});

app.delete('/make-server-c89a26e4/medical-records/:id', async (c) => {
  try {
    const recordId = c.req.param('id');
    
    const existingRecord = await kv.get(`dcms:medical-record:${recordId}`);
    if (!existingRecord) {
      return c.json({
        error: 'Medical record not found'
      }, 404);
    }

    // Soft delete by setting isActive to false
    const updatedRecord = {
      ...existingRecord,
      isActive: false,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:medical-record:${recordId}`, updatedRecord);

    return c.json({
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.log('Delete medical record error:', error);
    return c.json({
      error: 'Failed to delete medical record'
    }, 500);
  }
});

// Correction Requests Endpoints
app.get('/make-server-c89a26e4/correction-requests/:patientEmail', async (c) => {
  try {
    const patientEmail = c.req.param('patientEmail');
    
    const allRequests = await kv.getByPrefix('dcms:correction-request:');
    const patientRequests = allRequests.filter(req => req.patientEmail === patientEmail);

    return c.json({
      requests: patientRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.log('Get correction requests error:', error);
    return c.json({
      error: 'Failed to fetch correction requests'
    }, 500);
  }
});

app.get('/make-server-c89a26e4/correction-requests', async (c) => {
  try {
    // Get all pending correction requests for staff review
    const allRequests = await kv.getByPrefix('dcms:correction-request:');
    const pendingRequests = allRequests.filter(req => req.status === 'pending');

    return c.json({
      requests: pendingRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.log('Get all correction requests error:', error);
    return c.json({
      error: 'Failed to fetch correction requests'
    }, 500);
  }
});

app.post('/make-server-c89a26e4/correction-requests', async (c) => {
  try {
    const requestData = await c.req.json();
    const requestId = `req-${crypto.randomUUID()}`;
    
    const correctionRequest = {
      id: requestId,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:correction-request:${requestId}`, correctionRequest);

    // Create notification for staff
    const notificationId = `notif-${crypto.randomUUID()}`;
    const notification = {
      id: notificationId,
      type: 'correction_request',
      title: 'New Correction Request',
      message: `${requestData.patientName} has requested a correction to their ${requestData.recordType} record`,
      data: correctionRequest,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`dcms:notification:${notificationId}`, notification);

    return c.json({
      request: correctionRequest
    });
  } catch (error) {
    console.log('Create correction request error:', error);
    return c.json({
      error: 'Failed to create correction request'
    }, 500);
  }
});

app.put('/make-server-c89a26e4/correction-requests/:id', async (c) => {
  try {
    const requestId = c.req.param('id');
    const { action, reviewNotes, reviewedBy } = await c.req.json();
    
    const existingRequest = await kv.get(`dcms:correction-request:${requestId}`);
    if (!existingRequest) {
      return c.json({
        error: 'Correction request not found'
      }, 404);
    }

    const updatedRequest = {
      ...existingRequest,
      status: action === 'approve' ? 'approved' : 'denied',
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      reviewNotes,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:correction-request:${requestId}`, updatedRequest);

    // If approved, create new version of the medical record and mark old one as discarded
    if (action === 'approve') {
      const originalRecord = existingRequest.originalRecord;
      
      // Mark original record as inactive
      const oldRecord = {
        ...originalRecord,
        isActive: false,
        replacedAt: new Date().toISOString(),
        replacedBy: reviewedBy,
        updatedAt: new Date().toISOString()
      };
      
      await kv.set(`dcms:medical-record:${originalRecord.id}`, oldRecord);

      // Create new record with corrections applied
      const newRecordId = `record-${crypto.randomUUID()}`;
      const newRecord = { ...originalRecord };
      
      // Apply suggested changes
      existingRequest.suggestedChanges.forEach(change => {
        if (newRecord.hasOwnProperty(change.field)) {
          newRecord[change.field] = change.suggestedValue;
        }
      });

      newRecord.id = newRecordId;
      newRecord.isActive = true;
      newRecord.createdAt = new Date().toISOString();
      newRecord.updatedAt = new Date().toISOString();
      newRecord.correctionRequestId = requestId;

      await kv.set(`dcms:medical-record:${newRecordId}`, newRecord);
    }

    return c.json({
      request: updatedRequest
    });
  } catch (error) {
    console.log('Update correction request error:', error);
    return c.json({
      error: 'Failed to update correction request'
    }, 500);
  }
});

// Notifications Endpoints
app.get('/make-server-c89a26e4/notifications', async (c) => {
  try {
    const allNotifications = await kv.getByPrefix('dcms:notification:');
    
    return c.json({
      notifications: allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.log('Get notifications error:', error);
    return c.json({
      error: 'Failed to fetch notifications'
    }, 500);
  }
});

app.put('/make-server-c89a26e4/notifications/:id/read', async (c) => {
  try {
    const notificationId = c.req.param('id');
    
    const existingNotification = await kv.get(`dcms:notification:${notificationId}`);
    if (!existingNotification) {
      return c.json({
        error: 'Notification not found'
      }, 404);
    }

    const updatedNotification = {
      ...existingNotification,
      isRead: true,
      readAt: new Date().toISOString()
    };

    await kv.set(`dcms:notification:${notificationId}`, updatedNotification);

    return c.json({
      notification: updatedNotification
    });
  } catch (error) {
    console.log('Mark notification as read error:', error);
    return c.json({
      error: 'Failed to mark notification as read'
    }, 500);
  }
});

app.get('/make-server-c89a26e4/health', async (c)=>{
  try {
    console.log('=== Health Check Started ===');
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    console.log('Environment check:');
    console.log('SUPABASE_URL exists:', !!url);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!key);
    console.log('SUPABASE_URL value:', url ? `${url.substring(0, 30)}...` : 'NOT SET');
    const allUsers = await kv.getByPrefix('dcms:user:');
    console.log('Successfully queried users, count:', allUsers.length);
    console.log('=== Health Check Completed ===');
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      userCount: allUsers.length,
      environment: {
        hasUrl: !!url,
        hasKey: !!key,
        urlPreview: url ? `${url.substring(0, 30)}...` : 'NOT SET'
      },
      users: allUsers.map((u)=>({
          email: u.email,
          role: u.role,
          canLogin: u.canLogin
        }))
    });
  } catch (error) {
    console.error('=== Health Check Error ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== End Health Check Error ===');
    return c.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Auth endpoints
app.post('/make-server-c89a26e4/auth/signin', async (c)=>{
  try {
    const { email, password } = await c.req.json();
    console.log('Sign-in attempt for email:', email);
    
    if (!email || !password) {
      console.log('Missing email or password');
      return c.json({
        error: 'Email and password are required'
      }, 400);
    }

    // Check server-side login attempts tracking
    const attemptKey = `dcms:login-attempts:${email}`;
    const lockoutKey = `dcms:lockout:${email}`;
    
    // Check if user is currently locked out
    const lockoutData = await kv.get(lockoutKey);
    if (lockoutData) {
      const lockoutTime = new Date(lockoutData.lockedUntil);
      if (new Date() < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime.getTime() - new Date().getTime()) / 1000 / 60);
        console.log(`Login blocked - user ${email} is locked out for ${remainingTime} more minutes`);
        return c.json({
          error: `Too many failed login attempts. Please try again in ${remainingTime} minute${remainingTime !== 1 ? 's' : ''}.`
        }, 429); // Too Many Requests
      } else {
        // Lockout expired, clear it
        await kv.del(lockoutKey);
        await kv.del(attemptKey);
        console.log(`Lockout expired for ${email}, clearing records`);
      }
    }

    // Get user from KV store
    const userKey = `dcms:user:${email}`;
    const user = await kv.get(userKey);
    if (!user) {
      console.log('User not found for email:', email);
      
      // Track failed attempt for non-existent user
      await trackFailedLoginAttempt(email, attemptKey, lockoutKey);
      
      return c.json({
        error: 'No account exists with this email address'
      }, 401);
    }
    
    // Check if user is allowed to login (walk-in patients cannot login until they register)
    if (user.canLogin === false) {
      console.log('Login denied - user cannot login (walk-in patient):', email);
      return c.json({
        error: 'This account was created as a walk-in patient. Please register first to create your password and enable login access. Contact our staff if you need assistance.'
      }, 403);
    }
    
    if (user.password !== password) {
      console.log('Incorrect password for email:', email);
      
      // Track failed attempt for incorrect password
      await trackFailedLoginAttempt(email, attemptKey, lockoutKey);
      
      return c.json({
        error: 'Incorrect password. Please check your password and try again.'
      }, 401);
    }

    // Successful login - clear any failed attempts
    await kv.del(attemptKey);
    await kv.del(lockoutKey);
    console.log('Sign-in successful for:', email, 'Role:', user.role);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return c.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.log('Sign-in error:', error);
    return c.json({
      error: 'Authentication failed'
    }, 500);
  }
});

// Helper function to track failed login attempts
async function trackFailedLoginAttempt(email: string, attemptKey: string, lockoutKey: string) {
  try {
    const attemptData = await kv.get(attemptKey) || { count: 0, firstAttempt: new Date().toISOString() };
    attemptData.count += 1;
    attemptData.lastAttempt = new Date().toISOString();

    if (attemptData.count >= 3) {
      // Lock out user for 15 minutes
      const lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
      await kv.set(lockoutKey, {
        lockedUntil: lockoutUntil.toISOString(),
        attempts: attemptData.count,
        email: email
      });
      await kv.del(attemptKey); // Clear attempts as user is now locked out
      console.log(`User ${email} locked out after ${attemptData.count} failed attempts until ${lockoutUntil.toISOString()}`);
    } else {
      await kv.set(attemptKey, attemptData);
      console.log(`Failed login attempt ${attemptData.count}/3 for ${email}`);
    }
  } catch (error) {
    console.error('Error tracking failed login attempt:', error);
  }
}

app.post('/make-server-c89a26e4/auth/signup', async (c)=>{
  try {
    const { email, password, name, phone, role = 'patient' } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({
        error: 'Email, password, and name are required'
      }, 400);
    }
    // Check if user already exists
    const existingUser = await kv.get(`dcms:user:${email}`);
    if (existingUser) {
      // If it's a walk-in patient who can't login, allow them to complete registration
      if (existingUser.canLogin === false && existingUser.isWalkIn === true) {
        console.log('Walk-in patient completing registration:', email);
        // Update existing walk-in patient with login credentials
        const updatedUser = {
          ...existingUser,
          password,
          name: name || existingUser.name, // Keep existing name if not provided
          phone: phone || existingUser.phone, // Keep existing phone if not provided
          canLogin: true,
          registeredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await kv.set(`dcms:user:${email}`, updatedUser);
        // Return user without password
        const { password: _, ...userWithoutPassword } = updatedUser;
        return c.json({
          user: userWithoutPassword,
          message: 'Registration completed successfully! You can now log in.'
        });
      } else {
        return c.json({
          error: 'Account already exists with this email'
        }, 409);
      }
    }
    const user = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      phone: phone || '',
      role,
      createdAt: new Date().toISOString(),
      canLogin: role === 'patient' // Walk-in patients can't login until they register
    };
    await kv.set(`dcms:user:${email}`, user);
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return c.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.log('Sign-up error:', error);
    return c.json({
      error: 'Registration failed'
    }, 500);
  }
});

// Appointment email check endpoint
app.post('/make-server-c89a26e4/appointments/check-email', async (c)=>{
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({
        error: 'Email is required'
      }, 400);
    }

    // Get all appointments for this email
    const userAppointments = await kv.get(`dcms:user-appointments:${email}`) || [];
    
    // Check if user has any non-cancelled appointments
    let hasExistingBooking = false;
    for (const appointmentId of userAppointments) {
      const appointment = await kv.get(`dcms:appointment:${appointmentId}`);
      if (appointment && appointment.status !== 'cancelled' && appointment.status !== 'completed') {
        hasExistingBooking = true;
        break;
      }
    }

    return c.json({
      hasExistingBooking
    });
  } catch (error) {
    console.log('Check email error:', error);
    return c.json({
      error: 'Failed to check email'
    }, 500);
  }
});

// Available slots endpoint
app.post('/make-server-c89a26e4/available-slots', async (c)=>{
  try {
    const { date, serviceDuration = 60, bufferTime = 15 } = await c.req.json();
    
    if (!date) {
      return c.json({
        error: 'Date is required'
      }, 400);
    }

    // Get all appointments for the requested date
    const allAppointments = await kv.getByPrefix('dcms:appointment:');
    const dayAppointments = allAppointments.filter(apt => 
      apt.date === date && apt.status === 'booked'
    );

    // Define break times
    const breakTimes = [
      { start: '12:00', end: '13:00', name: 'Lunch Break' },  // 12 PM to 1 PM
      { start: '15:00', end: '15:15', name: 'Merienda' }      // 3 PM to 3:15 PM
    ];

    // Convert break times to minutes for easier comparison
    const breakTimesParsed = breakTimes.map(breakTime => ({
      startMinutes: parseInt(breakTime.start.split(':')[0]) * 60 + parseInt(breakTime.start.split(':')[1]),
      endMinutes: parseInt(breakTime.end.split(':')[0]) * 60 + parseInt(breakTime.end.split(':')[1]),
      name: breakTime.name
    }));

    // Generate time slots (9 AM to 5 PM, 15-minute intervals)
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const slotInterval = 15; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTimeMinutes = minute + serviceDuration + bufferTime;
        const endHour = hour + Math.floor(endTimeMinutes / 60);
        const endMinute = endTimeMinutes % 60;
        
        // Skip slots that would end after business hours
        if (endHour >= 17 && endMinute > 0) continue;
        if (endHour > 17) continue;
        
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Check if this slot conflicts with existing appointments or break times
        const startMinutes = hour * 60 + minute;
        const endMinutes = startMinutes + serviceDuration + bufferTime;
        
        let isAvailable = true;
        let conflictReason = '';
        
        // Check for break time conflicts
        for (const breakTime of breakTimesParsed) {
          if (startMinutes < breakTime.endMinutes && endMinutes > breakTime.startMinutes) {
            isAvailable = false;
            conflictReason = `Conflicts with ${breakTime.name}`;
            console.log(`Blocking slot ${startTime}-${endTime} due to ${breakTime.name} (${startMinutes}-${endMinutes} vs ${breakTime.startMinutes}-${breakTime.endMinutes})`);
            break;
          }
        }
        
        // Check for existing appointment conflicts (only if not already conflicting with break)
        if (isAvailable) {
          for (const apt of dayAppointments) {
            if (!apt.time) continue;
            
            const aptStartTime = apt.time;
            const aptDuration = apt.serviceDuration || 60;
            const aptBuffer = apt.bufferTime || 15;
            
            const aptStartHour = parseInt(aptStartTime.split(':')[0]);
            const aptStartMinute = parseInt(aptStartTime.split(':')[1]);
            const aptStartMinutes = aptStartHour * 60 + aptStartMinute;
            const aptEndMinutes = aptStartMinutes + aptDuration + aptBuffer;
            
            // Check for overlap
            if (startMinutes < aptEndMinutes && endMinutes > aptStartMinutes) {
              isAvailable = false;
              conflictReason = `Conflicts with appointment at ${aptStartTime}`;
              break;
            }
          }
        }
        
        slots.push({
          startTime,
          endTime,
          available: isAvailable,
          conflictReason: conflictReason || undefined
        });
      }
    }

    // For debugging, let's return both available and unavailable slots
    const availableSlots = slots.filter(slot => slot.available);
    const unavailableSlots = slots.filter(slot => !slot.available);
    
    // Enhanced debugging for merienda break
    const meriendaBreakSlots = slots.filter(slot => {
      const [hour, minute] = slot.startTime.split(':').map(Number);
      const startMinutes = hour * 60 + minute;
      const endMinutes = startMinutes + serviceDuration + bufferTime;
      // Check if overlaps with merienda (900-915 minutes = 15:00-15:15)
      return startMinutes < 915 && endMinutes > 900;
    });
    
    console.log(`=== SLOT DEBUG INFO FOR ${date} ===`);
    console.log(`Service: ${serviceDuration}min + ${bufferTime}min buffer = ${serviceDuration + bufferTime}min total`);
    console.log(`Total slots generated: ${slots.length}, Available: ${availableSlots.length}, Unavailable: ${unavailableSlots.length}`);
    console.log('Break times parsed:', breakTimesParsed);
    console.log(`Merienda-overlapping slots (should all be blocked): ${meriendaBreakSlots.length}`);
    
    // Log merienda break analysis
    meriendaBreakSlots.forEach(slot => {
      const [hour, minute] = slot.startTime.split(':').map(Number);
      const startMinutes = hour * 60 + minute;
      const endMinutes = startMinutes + serviceDuration + bufferTime;
      console.log(`  Slot ${slot.startTime}-${slot.endTime}: ${startMinutes}-${endMinutes}min, Available: ${slot.available}, Reason: ${slot.conflictReason || 'none'}`);
    });
    
    console.log('=== END SLOT DEBUG ===');
    
    return c.json({
      slots: availableSlots, // Only return available slots
      debug: {
        totalSlots: slots.length,
        availableCount: availableSlots.length,
        unavailableSlots: unavailableSlots.map(s => ({ time: s.startTime, reason: s.conflictReason })),
        meriendaAnalysis: {
          breakTime: '15:00-15:15 (900-915 minutes)',
          serviceTotal: `${serviceDuration + bufferTime} minutes`,
          slotsInRange: meriendaBreakSlots.length,
          blockedSlots: meriendaBreakSlots.filter(s => !s.available).length,
          availableSlots: meriendaBreakSlots.filter(s => s.available).length
        }
      }
    });
  } catch (error) {
    console.log('Available slots error:', error);
    return c.json({
      error: 'Failed to calculate available slots'
    }, 500);
  }
});

// Appointment endpoints
app.post('/make-server-c89a26e4/appointments', async (c)=>{
  try {
    const appointmentData = await c.req.json();
    const appointmentId = crypto.randomUUID();
    
    // Handle user creation for home booking requests
    if ((appointmentData.type === 'home_booking_request' || appointmentData.type === 'logged_in_booking_request') 
        && appointmentData.patientEmail && !appointmentData.existingUserId) {
      
      // Check if user already exists
      const existingUser = await kv.get(`dcms:user:${appointmentData.patientEmail}`);
      
      if (!existingUser) {
        // Create new anonymous patient record
        const userId = `user-${crypto.randomUUID()}`;
        const [firstName, ...lastNameParts] = appointmentData.patientName.split(' ');
        const lastName = lastNameParts.join(' ');
        
        const newUser = {
          id: userId,
          first_name: firstName,
          last_name: lastName,
          role: 'patient',
          email: appointmentData.patientEmail,
          phone: appointmentData.patientPhone || null,
          canLogin: false,
          password: null,
          registrationType: 'anonymous',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        };
        
        await kv.set(`dcms:user:${appointmentData.patientEmail}`, newUser);
        console.log(`Created new anonymous user: ${appointmentData.patientEmail}`);
      }
    }
    
    const appointment = {
      id: appointmentId,
      ...appointmentData,
      status: 'booked',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // All appointments are auto-confirmed
      appointmentDate: appointmentData.requestedDate || appointmentData.appointmentDate,
      appointmentTime: appointmentData.requestedTimeSlot ? appointmentData.requestedTimeSlot.split('-')[0] : appointmentData.appointmentTime,
      // Only assign dentist if not from patient-initiated booking
      dentistName: (appointmentData.type === 'home_booking_request' || appointmentData.type === 'logged_in_booking_request') 
        ? undefined 
        : (appointmentData.dentistName || 'Dr. Sarah Johnson'),
      // Include serviceDetails if provided
      serviceDetails: appointmentData.serviceDetails || null
    };
    await kv.set(`dcms:appointment:${appointmentId}`, appointment);
    // Add to user's appointments list
    if (appointmentData.patientEmail) {
      const userAppointments = await kv.get(`dcms:user-appointments:${appointmentData.patientEmail}`) || [];
      userAppointments.push(appointmentId);
      await kv.set(`dcms:user-appointments:${appointmentData.patientEmail}`, userAppointments);
    }
    return c.json({
      appointment
    });
  } catch (error) {
    console.log('Create appointment error:', error);
    return c.json({
      error: 'Failed to create appointment'
    }, 500);
  }
});

app.get('/make-server-c89a26e4/appointments', async (c)=>{
  try {
    const userEmail = c.req.query('userEmail');
    const role = c.req.query('role');
    const currentDateOnly = c.req.query('currentDateOnly');
    
    // Get current date in YYYY-MM-DD format for filtering
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (role === 'patient' && userEmail) {
      // Get patient's appointments only
      const appointmentIds = await kv.get(`dcms:user-appointments:${userEmail}`) || [];
      const appointments = [];
      for (const id of appointmentIds){
        const appointment = await kv.get(`dcms:appointment:${id}`);
        if (appointment) {
          // Filter by current date if requested
          if (currentDateOnly === 'true') {
            const appointmentDate = appointment.appointmentDate || appointment.requestedDate;
            if (appointmentDate === currentDate) {
              appointments.push(appointment);
            }
          } else {
            appointments.push(appointment);
          }
        }
      }
      return c.json({
        appointments
      });
    } else {
      // Staff/Dentist/Admin can see all appointments
      const allAppointments = await kv.getByPrefix('dcms:appointment:');
      
      // Filter by current date if requested
      let appointments = allAppointments;
      if (currentDateOnly === 'true') {
        appointments = allAppointments.filter(appointment => {
          const appointmentDate = appointment.appointmentDate || appointment.requestedDate;
          return appointmentDate === currentDate;
        });
      }
      
      return c.json({
        appointments
      });
    }
  } catch (error) {
    console.log('Get appointments error:', error);
    return c.json({
      error: 'Failed to fetch appointments'
    }, 500);
  }
});

// Get single appointment endpoint
app.get('/make-server-c89a26e4/appointments/:id', async (c) => {
  try {
    const appointmentId = c.req.param('id');
    
    const appointment = await kv.get(`dcms:appointment:${appointmentId}`);
    if (!appointment) {
      return c.json({
        error: 'Appointment not found'
      }, 404);
    }
    
    return c.json({
      appointment
    });
  } catch (error) {
    console.log('Get single appointment error:', error);
    return c.json({
      error: 'Failed to fetch appointment'
    }, 500);
  }
});

app.put('/make-server-c89a26e4/appointments/:id', async (c)=>{
  try {
    const appointmentId = c.req.param('id');
    const updates = await c.req.json();
    const appointment = await kv.get(`dcms:appointment:${appointmentId}`);
    if (!appointment) {
      return c.json({
        error: 'Appointment not found'
      }, 404);
    }
    const updatedAppointment = {
      ...appointment,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // If status is being updated to cancelled, ensure we have a cancellation reason
    if (updates.status === 'cancelled' && !updates.cancellationReason) {
      updatedAppointment.cancellationReason = 'other';
    }
    await kv.set(`dcms:appointment:${appointmentId}`, updatedAppointment);
    return c.json({
      appointment: updatedAppointment
    });
  } catch (error) {
    console.log('Update appointment error:', error);
    return c.json({
      error: 'Failed to update appointment'
    }, 500);
  }
});

// Appointment confirmation endpoint
app.put('/make-server-c89a26e4/appointments/:id/confirm', async (c) => {
  try {
    const appointmentId = c.req.param('id');
    const updates = await c.req.json();
    
    const appointment = await kv.get(`dcms:appointment:${appointmentId}`);
    if (!appointment) {
      return c.json({
        error: 'Appointment not found'
      }, 404);
    }

    const confirmedAppointment = {
      ...appointment,
      ...updates,
      status: 'booked',
      needsStaffConfirmation: false,
      confirmedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:appointment:${appointmentId}`, confirmedAppointment);
    
    return c.json({
      appointment: confirmedAppointment
    });
  } catch (error) {
    console.log('Confirm appointment error:', error);
    return c.json({
      error: 'Failed to confirm appointment'
    }, 500);
  }
});

// Appointment status update endpoint
app.put('/make-server-c89a26e4/appointments/:id/status', async (c) => {
  try {
    const appointmentId = c.req.param('id');
    const { status, updatedBy, cancellationReason, cancellationNotes, cancelledBy } = await c.req.json();
    
    const appointment = await kv.get(`dcms:appointment:${appointmentId}`);
    if (!appointment) {
      return c.json({
        error: 'Appointment not found'
      }, 404);
    }

    const updatedAppointment = {
      ...appointment,
      status,
      updatedBy: updatedBy || cancelledBy,
      statusUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Handle cancellation-specific fields
    if (status === 'cancelled') {
      updatedAppointment.cancellationReason = cancellationReason || 'other';
      updatedAppointment.cancellationNotes = cancellationNotes;
      updatedAppointment.cancelledAt = new Date().toISOString();
      updatedAppointment.cancelledBy = cancelledBy || updatedBy;
    }

    // Handle completion-specific fields
    if (status === 'completed') {
      updatedAppointment.completedAt = new Date().toISOString();
    }

    await kv.set(`dcms:appointment:${appointmentId}`, updatedAppointment);
    
    return c.json({
      appointment: updatedAppointment
    });
  } catch (error) {
    console.log('Update appointment status error:', error);
    return c.json({
      error: 'Failed to update appointment status'
    }, 500);
  }
});

// Appointment completion endpoint - updates appointment directly
const handleAppointmentComplete = async (c) => {
  try {
    const appointmentId = c.req.param('id');
    const updatedAppointmentData = await c.req.json();
    
    const existingAppointment = await kv.get(`dcms:appointment:${appointmentId}`);
    if (!existingAppointment) {
      return c.json({
        error: 'Appointment not found'
      }, 404);
    }

    // Validate serviceDetails
    if (!updatedAppointmentData.serviceDetails || !Array.isArray(updatedAppointmentData.serviceDetails) || updatedAppointmentData.serviceDetails.length === 0) {
      return c.json({
        error: 'At least one service is required in serviceDetails'
      }, 400);
    }

    // Validate each service has required fields
    for (const service of updatedAppointmentData.serviceDetails) {
      if (!service.name || service.name.trim() === '') {
        return c.json({
          error: 'All services must have a name'
        }, 400);
      }
      
      // Additional validation for treatment services
      if (service.has_treatment_detail && service.treatments && service.treatments.length > 0) {
        const hasValidTreatment = service.treatments.some(treatment => 
          treatment.detail && treatment.detail.trim() !== ''
        );
        if (!hasValidTreatment) {
          return c.json({
            error: 'Treatment services must have at least one valid treatment detail'
          }, 400);
        }
      }
    }

    const completedAppointment = {
      ...existingAppointment,
      ...updatedAppointmentData,
      status: 'completed',
      completedAt: new Date().toISOString(),
      statusUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:appointment:${appointmentId}`, completedAppointment);
    
    console.log(`Appointment ${appointmentId} completed with ${updatedAppointmentData.serviceDetails.length} services by ${updatedAppointmentData.completedBy}`);
    
    return c.json({
      appointment: completedAppointment
    });
  } catch (error) {
    console.log('Complete appointment error:', error);
    return c.json({
      error: 'Failed to complete appointment'
    }, 500);
  }
};

app.put('/make-server-c89a26e4/appointments/:id/complete', handleAppointmentComplete);
app.patch('/make-server-c89a26e4/appointments/:id/complete', handleAppointmentComplete);

// Notes endpoints
app.post('/make-server-c89a26e4/appointments/:id/notes', async (c)=>{
  try {
    const appointmentId = c.req.param('id');
    const { content, authorEmail, authorRole } = await c.req.json();
    const noteId = crypto.randomUUID();
    const note = {
      id: noteId,
      appointmentId,
      content,
      authorEmail,
      authorRole,
      createdAt: new Date().toISOString()
    };
    await kv.set(`dcms:note:${noteId}`, note);
    // Add to appointment's notes list
    const appointmentNotes = await kv.get(`dcms:appointment-notes:${appointmentId}`) || [];
    appointmentNotes.push(noteId);
    await kv.set(`dcms:appointment-notes:${appointmentId}`, appointmentNotes);
    return c.json({
      note
    });
  } catch (error) {
    console.log('Create note error:', error);
    return c.json({
      error: 'Failed to create note'
    }, 500);
  }
});

app.get('/make-server-c89a26e4/appointments/:id/notes', async (c)=>{
  try {
    const appointmentId = c.req.param('id');
    const noteIds = await kv.get(`dcms:appointment-notes:${appointmentId}`) || [];
    const notes = [];
    for (const id of noteIds){
      const note = await kv.get(`dcms:note:${id}`);
      if (note) notes.push(note);
    }
    return c.json({
      notes
    });
  } catch (error) {
    console.log('Get notes error:', error);
    return c.json({
      error: 'Failed to fetch notes'
    }, 500);
  }
});

// Walk-in patient endpoint (staff only)
app.post('/make-server-c89a26e4/walk-in-patient', async (c)=>{
  try {
    const { name, phone, email, staffEmail } = await c.req.json();
    // Create walk-in patient (can't login until they register)
    const patientId = crypto.randomUUID();
    const patient = {
      id: patientId,
      name,
      phone,
      email,
      role: 'patient',
      canLogin: false,
      createdBy: staffEmail,
      createdAt: new Date().toISOString(),
      isWalkIn: true
    };
    await kv.set(`dcms:user:${email}`, patient);
    return c.json({
      patient
    });
  } catch (error) {
    console.log('Create walk-in patient error:', error);
    return c.json({
      error: 'Failed to create walk-in patient'
    }, 500);
  }
});

// Profile update endpoint
app.put('/make-server-c89a26e4/profile/:email', async (c)=>{
  try {
    const email = c.req.param('email');
    const updates = await c.req.json();
    const user = await kv.get(`dcms:user:${email}`);
    if (!user) {
      return c.json({
        error: 'User not found'
      }, 404);
    }
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await kv.set(`dcms:user:${email}`, updatedUser);
    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return c.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.log('Profile update error:', error);
    return c.json({
      error: 'Failed to update profile'
    }, 500);
  }
});

// Admin endpoints - create staff/dentist users
app.post('/make-server-c89a26e4/admin/users', async (c)=>{
  try {
    const { email, password, name, role, createdByAdmin } = await c.req.json();
    if (role !== 'staff' && role !== 'dentist') {
      return c.json({
        error: 'Admin can only create staff and dentist users'
      }, 400);
    }
    // Check if user already exists
    const existingUser = await kv.get(`dcms:user:${email}`);
    if (existingUser) {
      return c.json({
        error: 'User already exists with this email'
      }, 409);
    }
    const user = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      role,
      canLogin: true,
      createdBy: createdByAdmin,
      createdAt: new Date().toISOString()
    };
    await kv.set(`dcms:user:${email}`, user);
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return c.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.log('Admin create user error:', error);
    return c.json({
      error: 'Failed to create user'
    }, 500);
  }
});

// Get all staff and dentists (admin only)
app.get('/make-server-c89a26e4/admin/users', async (c)=>{
  try {
    const allUsers = await kv.getByPrefix('dcms:user:');
    const staffAndDentists = allUsers.filter((user)=>user.role === 'staff' || user.role === 'dentist').map((user)=>{
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    return c.json({
      users: staffAndDentists
    });
  } catch (error) {
    console.log('Get staff/dentists error:', error);
    return c.json({
      error: 'Failed to fetch users'
    }, 500);
  }
});

// Get all patients (staff/dentist/admin only)
app.get('/make-server-c89a26e4/patients', async (c)=>{
  try {
    const allUsers = await kv.getByPrefix('dcms:user:');
    const patients = allUsers.filter((user)=>user.role === 'patient').map((user)=>{
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    return c.json({
      patients
    });
  } catch (error) {
    console.log('Get patients error:', error);
    return c.json({
      error: 'Failed to fetch patients'
    }, 500);
  }
});

// Get individual patient profile endpoint
app.get('/make-server-c89a26e4/patients/:id', async (c) => {
  try {
    const patientId = c.req.param('id');
    
    // Try to find patient by ID first, then by email as fallback
    let patient = null;
    const allUsers = await kv.getByPrefix('dcms:user:');
    
    // Find by ID or email
    patient = allUsers.find(user => user.id === patientId || user.email === patientId);
    
    if (!patient || patient.role !== 'patient') {
      return c.json({
        error: 'Patient not found'
      }, 404);
    }
    
    // Get patient's appointments
    const appointmentIds = await kv.get(`dcms:user-appointments:${patient.email}`) || [];
    const appointments = [];
    for (const id of appointmentIds) {
      const appointment = await kv.get(`dcms:appointment:${id}`);
      if (appointment) appointments.push(appointment);
    }
    
    const { password: _, ...patientWithoutPassword } = patient;
    
    return c.json({
      patient: patientWithoutPassword,
      appointments
    });
  } catch (error) {
    console.log('Get patient profile error:', error);
    return c.json({
      error: 'Failed to fetch patient profile'
    }, 500);
  }
});

// Get all dentists endpoint
app.get('/make-server-c89a26e4/dentists', async (c) => {
  try {
    const allUsers = await kv.getByPrefix('dcms:user:');
    const dentists = allUsers
      .filter(user => user.role === 'dentist')
      .map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    
    return c.json({
      dentists
    });
  } catch (error) {
    console.log('Get dentists error:', error);
    return c.json({
      error: 'Failed to fetch dentists'
    }, 500);
  }
});

// Available slots endpoint for smart booking
app.post('/make-server-c89a26e4/available-slots', async (c) => {
  try {
    const { date, serviceDuration = 60, bufferTime = 15 } = await c.req.json();
    
    if (!date) {
      return c.json({
        error: 'Date is required'
      }, 400);
    }

    // Get all confirmed appointments for the given date
    const allAppointments = await kv.getByPrefix('dcms:appointment:');
    const appointmentsOnDate = allAppointments.filter(apt => 
      apt.status === 'confirmed' && 
      apt.appointmentDate === date
    );

    // Define available time slots (in military time)
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    // Calculate end time for each slot based on service duration + buffer
    const totalDuration = serviceDuration + bufferTime;
    
    const availableSlots = baseSlots.map(startTime => {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + totalDuration;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

      // Check if this slot conflicts with existing appointments
      const hasConflict = appointmentsOnDate.some(apt => {
        if (!apt.appointmentTime) return false;
        
        const [aptHours, aptMinutes] = apt.appointmentTime.split(':').map(Number);
        const aptStartMinutes = aptHours * 60 + aptMinutes;
        const aptDuration = 60; // Assume 60 min default duration
        const aptEndMinutes = aptStartMinutes + aptDuration;

        // Check for overlap
        return (startMinutes < aptEndMinutes && endMinutes > aptStartMinutes);
      });

      return {
        startTime,
        endTime,
        available: !hasConflict,
        conflictReason: hasConflict ? 'Time slot already booked' : undefined
      };
    });

    return c.json({
      slots: availableSlots,
      date,
      serviceDuration,
      bufferTime
    });
  } catch (error) {
    console.log('Available slots error:', error);
    return c.json({
      error: 'Failed to calculate available slots'
    }, 500);
  }
});

// Services catalog endpoints
app.get('/make-server-c89a26e4/services', async (c) => {
  try {
    const allServices = await kv.getByPrefix('dcms:service-catalog:');
    return c.json({
      services: allServices
    });
  } catch (error) {
    console.log('Get services error:', error);
    return c.json({
      error: 'Failed to fetch services'
    }, 500);
  }
});

app.post('/make-server-c89a26e4/services', async (c) => {
  try {
    const serviceData = await c.req.json();
    const serviceId = crypto.randomUUID();
    
    const service = {
      id: serviceId,
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`dcms:service-catalog:${serviceId}`, service);
    
    return c.json({
      service
    });
  } catch (error) {
    console.log('Create service error:', error);
    return c.json({
      error: 'Failed to create service'
    }, 500);
  }
});

app.put('/make-server-c89a26e4/services/:id', async (c) => {
  try {
    const serviceId = c.req.param('id');
    const updates = await c.req.json();
    
    const service = await kv.get(`dcms:service-catalog:${serviceId}`);
    if (!service) {
      return c.json({
        error: 'Service not found'
      }, 404);
    }
    
    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`dcms:service-catalog:${serviceId}`, updatedService);
    
    return c.json({
      service: updatedService
    });
  } catch (error) {
    console.log('Update service error:', error);
    return c.json({
      error: 'Failed to update service'
    }, 500);
  }
});

app.delete('/make-server-c89a26e4/services/:id', async (c) => {
  try {
    const serviceId = c.req.param('id');
    
    const service = await kv.get(`dcms:service-catalog:${serviceId}`);
    if (!service) {
      return c.json({
        error: 'Service not found'
      }, 404);
    }
    
    await kv.delete(`dcms:service-catalog:${serviceId}`);
    
    return c.json({
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.log('Delete service error:', error);
    return c.json({
      error: 'Failed to delete service'
    }, 500);
  }
});

// Appointment service entry endpoint for completing appointments with treatment details
app.post('/make-server-c89a26e4/appointments/:id/service-entry', async (c) => {
  try {
    const appointmentId = c.req.param('id');
    const serviceEntryData = await c.req.json();
    
    const appointment = await kv.get(`dcms:appointment:${appointmentId}`);
    if (!appointment) {
      return c.json({
        error: 'Appointment not found'
      }, 404);
    }
    
    // Update appointment with service entry data
    const updatedAppointment = {
      ...appointment,
      status: 'completed',
      serviceEntry: serviceEntryData,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`dcms:appointment:${appointmentId}`, updatedAppointment);
    
    return c.json({
      appointment: updatedAppointment
    });
  } catch (error) {
    console.log('Service entry error:', error);
    return c.json({
      error: 'Failed to complete service entry'
    }, 500);
  }
});

// Smart time slot availability endpoint
app.post('/make-server-c89a26e4/available-slots', async (c)=>{
  try {
    const { date, serviceDuration, bufferTime } = await c.req.json();
    
    if (!date || !serviceDuration || bufferTime === undefined) {
      return c.json({
        error: 'Date, serviceDuration, and bufferTime are required'
      }, 400);
    }

    console.log(`Calculating slots for date: ${date}, duration: ${serviceDuration}min, buffer: ${bufferTime}min`);

    // Get all appointments for the specified date
    const allAppointments = await kv.getByPrefix('dcms:appointment:');
    const dayAppointments = allAppointments.filter(apt => {
      // Check both confirmed appointments (with date field) and pending appointments (with requestedDate)
      const appointmentDate = apt.date || apt.requestedDate;
      return appointmentDate === date && apt.status !== 'cancelled';
    });
    
    console.log(`Found ${dayAppointments.length} existing appointments for ${date}`);

    // Define working hours (9:00 AM to 5:00 PM)
    const workStart = 9 * 60; // 9:00 AM in minutes
    const workEnd = 17 * 60;   // 5:00 PM in minutes
    const slotInterval = 15;   // 15-minute intervals
    const totalSlotTime = serviceDuration + bufferTime; // Total time needed

    const availableSlots = [];
    
    // Generate all possible time slots
    for (let startMinutes = workStart; startMinutes < workEnd; startMinutes += slotInterval) {
      const slotEndMinutes = startMinutes + totalSlotTime;
      
      // Skip if slot would extend beyond working hours
      if (slotEndMinutes > workEnd) {
        continue;
      }

      const startTime = formatMinutesToTime(startMinutes);
      const endTime = formatMinutesToTime(slotEndMinutes);
      
      // Check for conflicts with existing appointments
      let hasConflict = false;
      let conflictReason = '';
      
      for (const appointment of dayAppointments) {
        // Get appointment time - could be confirmed time or requested time slot
        let aptStartTime, aptDuration = 60, aptBuffer = 15;
        
        if (appointment.time) {
          // Confirmed appointment with specific time
          aptStartTime = appointment.time;
          aptDuration = appointment.serviceDuration || 60;
          aptBuffer = appointment.bufferTime || 15;
        } else if (appointment.requestedTimeSlot) {
          // Pending appointment with requested time slot (e.g., "10:00-11:15")
          const [startTimeStr] = appointment.requestedTimeSlot.split('-');
          aptStartTime = startTimeStr;
          aptDuration = appointment.serviceDuration || 60;
          aptBuffer = appointment.bufferTime || 15;
        } else {
          // Fallback - skip appointments without time information
          continue;
        }
        
        const aptStart = timeToMinutes(aptStartTime);
        const aptEnd = aptStart + aptDuration + aptBuffer;
        
        // Check if there's any overlap
        if (!(slotEndMinutes <= aptStart || startMinutes >= aptEnd)) {
          hasConflict = true;
          conflictReason = `Conflicts with existing appointment at ${aptStartTime} (${appointment.patientName})`;
          break;
        }
      }

      availableSlots.push({
        startTime,
        endTime,
        available: !hasConflict,
        conflictReason: hasConflict ? conflictReason : undefined
      });
    }

    console.log(`Generated ${availableSlots.length} time slots, ${availableSlots.filter(s => s.available).length} available`);

    return c.json({
      slots: availableSlots,
      metadata: {
        date,
        serviceDuration,
        bufferTime,
        totalSlotTime,
        existingAppointments: dayAppointments.length
      }
    });
  } catch (error) {
    console.log('Calculate available slots error:', error);
    return c.json({
      error: 'Failed to calculate available slots'
    }, 500);
  }
});

// Helper function to convert minutes to HH:MM format
function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Helper function to convert HH:MM format to minutes
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Inventory endpoints
app.get('/make-server-c89a26e4/inventory', async (c) => {
  try {
    const allItems = await kv.getByPrefix('dcms:inventory:');
    return c.json({
      items: allItems
    });
  } catch (error) {
    console.log('Get inventory error:', error);
    return c.json({
      error: 'Failed to fetch inventory'
    }, 500);
  }
});

app.post('/make-server-c89a26e4/inventory', async (c) => {
  try {
    const itemData = await c.req.json();
    const itemId = crypto.randomUUID();
    
    // Validate required fields for new inventory structure
    if (!itemData.itemName || !itemData.category || !itemData.unit || !itemData.purchaseUnit || !itemData.conversionFactor) {
      return c.json({
        error: 'Missing required fields: itemName, category, unit, purchaseUnit, conversionFactor'
      }, 400);
    }
    
    const item = {
      id: itemId,
      itemName: itemData.itemName,
      category: itemData.category,
      quantity: itemData.quantity || 0, // quantity in usage units
      unit: itemData.unit, // usage unit
      purchaseUnit: itemData.purchaseUnit, // purchase unit
      conversionFactor: itemData.conversionFactor, // usage units per purchase unit
      minThreshold: itemData.minThreshold || 0,
      maxThreshold: itemData.maxThreshold || 0,
      addedBy: itemData.addedBy,
      lastRestocked: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`dcms:inventory:${itemId}`, item);
    
    return c.json({
      item
    });
  } catch (error) {
    console.log('Create inventory item error:', error);
    return c.json({
      error: 'Failed to create inventory item'
    }, 500);
  }
});

app.put('/make-server-c89a26e4/inventory/:id', async (c) => {
  try {
    const itemId = c.req.param('id');
    const updateData = await c.req.json();
    
    const item = await kv.get(`dcms:inventory:${itemId}`);
    if (!item) {
      return c.json({
        error: 'Inventory item not found'
      }, 404);
    }
    
    // Validate required fields
    if (!updateData.itemName || !updateData.category || !updateData.unit || !updateData.purchaseUnit || !updateData.conversionFactor) {
      return c.json({
        error: 'Missing required fields: itemName, category, unit, purchaseUnit, conversionFactor'
      }, 400);
    }
    
    const updatedItem = {
      ...item,
      itemName: updateData.itemName,
      category: updateData.category,
      unit: updateData.unit,
      purchaseUnit: updateData.purchaseUnit,
      conversionFactor: updateData.conversionFactor,
      minThreshold: updateData.minThreshold || 0,
      maxThreshold: updateData.maxThreshold || 0,
      updatedBy: updateData.updatedBy,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`dcms:inventory:${itemId}`, updatedItem);
    
    return c.json({
      item: updatedItem
    });
  } catch (error) {
    console.log('Update inventory item error:', error);
    return c.json({
      error: 'Failed to update inventory item'
    }, 500);
  }
});

app.post('/make-server-c89a26e4/inventory/:id/restock', async (c) => {
  try {
    const itemId = c.req.param('id');
    const { quantity, purchaseQuantity, notes, restockedBy } = await c.req.json();
    
    const item = await kv.get(`dcms:inventory:${itemId}`);
    if (!item) {
      return c.json({
        error: 'Inventory item not found'
      }, 404);
    }
    
    if (quantity <= 0) {
      return c.json({
        error: 'Quantity must be greater than 0'
      }, 400);
    }
    
    const updatedItem = {
      ...item,
      quantity: item.quantity + quantity, // quantity is already in usage units
      lastRestocked: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create restock log entry with both usage and purchase quantities
    const restockLogId = crypto.randomUUID();
    const restockLog = {
      id: restockLogId,
      itemId,
      itemName: item.itemName,
      usageQuantity: quantity, // quantity in usage units
      purchaseQuantity: purchaseQuantity || 0, // quantity in purchase units
      purchaseUnit: item.purchaseUnit,
      usageUnit: item.unit,
      conversionFactor: item.conversionFactor,
      notes: notes || '',
      restockedBy,
      previousQuantity: item.quantity,
      newQuantity: updatedItem.quantity,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`dcms:inventory:${itemId}`, updatedItem);
    await kv.set(`dcms:restock-log:${restockLogId}`, restockLog);
    
    // Add to item's restock history
    const restockHistory = await kv.get(`dcms:restock-history:${itemId}`) || [];
    restockHistory.push(restockLogId);
    await kv.set(`dcms:restock-history:${itemId}`, restockHistory);
    
    return c.json({
      item: updatedItem,
      restockLog
    });
  } catch (error) {
    console.log('Restock inventory item error:', error);
    return c.json({
      error: 'Failed to restock inventory item'
    }, 500);
  }
});

app.delete('/make-server-c89a26e4/inventory/:id', async (c) => {
  try {
    const itemId = c.req.param('id');
    
    const item = await kv.get(`dcms:inventory:${itemId}`);
    if (!item) {
      return c.json({
        error: 'Inventory item not found'
      }, 404);
    }
    
    await kv.delete(`dcms:inventory:${itemId}`);
    
    return c.json({
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.log('Delete inventory item error:', error);
    return c.json({
      error: 'Failed to delete inventory item'
    }, 500);
  }
});

// Billing endpoints
app.get('/make-server-c89a26e4/billing', async (c) => {
  try {
    const allBills = await kv.getByPrefix('dcms:bill:');
    return c.json({
      bills: allBills
    });
  } catch (error) {
    console.log('Get billing data error:', error);
    return c.json({
      error: 'Failed to fetch billing data'
    }, 500);
  }
});

app.get('/make-server-c89a26e4/billing/stats', async (c) => {
  try {
    const allBills = await kv.getByPrefix('dcms:bill:');
    const today = new Date().toISOString().split('T')[0];
    
    const todayBills = allBills.filter(bill => 
      bill.createdAt && bill.createdAt.startsWith(today)
    );
    
    const totalBilledToday = todayBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const paymentsReceivedToday = todayBills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const outstandingBalances = allBills.reduce((sum, bill) => sum + bill.outstandingBalance, 0);
    
    return c.json({
      stats: {
        totalBilledToday,
        paymentsReceivedToday,
        outstandingBalances
      }
    });
  } catch (error) {
    console.log('Get billing stats error:', error);
    return c.json({
      error: 'Failed to fetch billing stats'
    }, 500);
  }
});

app.post('/make-server-c89a26e4/billing', async (c) => {
  try {
    const billData = await c.req.json();
    
    // Validate required fields
    if (!billData.appointmentId || !billData.patientId || !billData.items || !billData.totalAmount) {
      return c.json({
        error: 'Missing required fields: appointmentId, patientId, items, totalAmount'
      }, 400);
    }

    const billId = `bill-${crypto.randomUUID()}`;
    const outstandingBalance = billData.totalAmount - (billData.paidAmount || 0);
    
    let status = 'pending';
    if (billData.paidAmount >= billData.totalAmount) {
      status = 'paid';
    } else if (billData.paidAmount > 0) {
      status = 'partial';
    }
    
    const bill = {
      id: billId,
      appointmentId: billData.appointmentId,
      patientId: billData.patientId,
      patientName: billData.patientName,
      patientEmail: billData.patientEmail,
      patientPhone: billData.patientPhone,
      items: billData.items,
      totalAmount: billData.totalAmount,
      paidAmount: billData.paidAmount || 0,
      outstandingBalance,
      paymentMethod: billData.paymentMethod,
      status,
      notes: billData.notes || '',
      createdBy: billData.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save the bill
    await kv.set(`dcms:bill:${billId}`, bill);
    
    // Update the appointment with has_bill: true
    const appointment = await kv.get(`dcms:appointment:${billData.appointmentId}`);
    if (appointment) {
      const updatedAppointment = {
        ...appointment,
        has_bill: true,
        billId: billId,
        updatedAt: new Date().toISOString()
      };
      await kv.set(`dcms:appointment:${billData.appointmentId}`, updatedAppointment);
    }
    
    return c.json({
      bill
    });
  } catch (error) {
    console.log('Create bill error:', error);
    return c.json({
      error: 'Failed to create bill'
    }, 500);
  }
});

app.get('/make-server-c89a26e4/billing/:id', async (c) => {
  try {
    const billId = c.req.param('id');
    
    const bill = await kv.get(`dcms:bill:${billId}`);
    if (!bill) {
      return c.json({
        error: 'Bill not found'
      }, 404);
    }
    
    return c.json({
      bill
    });
  } catch (error) {
    console.log('Get bill error:', error);
    return c.json({
      error: 'Failed to fetch bill'
    }, 500);
  }
});

app.put('/make-server-c89a26e4/billing/:id', async (c) => {
  try {
    const billId = c.req.param('id');
    const updateData = await c.req.json();
    
    const bill = await kv.get(`dcms:bill:${billId}`);
    if (!bill) {
      return c.json({
        error: 'Bill not found'
      }, 404);
    }
    
    const totalAmount = updateData.totalAmount || bill.totalAmount;
    const paidAmount = updateData.paidAmount !== undefined ? updateData.paidAmount : bill.paidAmount;
    const outstandingBalance = totalAmount - paidAmount;
    
    let status = bill.status;
    if (paidAmount >= totalAmount) {
      status = 'paid';
    } else if (paidAmount > 0) {
      status = 'partial';
    } else {
      status = 'pending';
    }
    
    const updatedBill = {
      ...bill,
      ...updateData,
      outstandingBalance,
      status,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`dcms:bill:${billId}`, updatedBill);
    
    return c.json({
      bill: updatedBill
    });
  } catch (error) {
    console.log('Update bill error:', error);
    return c.json({
      error: 'Failed to update bill'
    }, 500);
  }
});

// Get restock history for an item
app.get('/make-server-c89a26e4/inventory/:id/restock-history', async (c) => {
  try {
    const itemId = c.req.param('id');
    
    const restockIds = await kv.get(`dcms:restock-history:${itemId}`) || [];
    const restockHistory = [];
    
    for (const id of restockIds) {
      const log = await kv.get(`dcms:restock-log:${id}`);
      if (log) restockHistory.push(log);
    }
    
    // Sort by most recent first
    restockHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({
      restockHistory
    });
  } catch (error) {
    console.log('Get restock history error:', error);
    return c.json({
      error: 'Failed to fetch restock history'
    }, 500);
  }
});

// Patients endpoint - get all patients for staff/admin
app.get('/make-server-c89a26e4/patients', async (c) => {
  try {
    const allUsers = await kv.getByPrefix('dcms:user:');
    const patients = allUsers
      .filter(user => user.role === 'patient')
      .map(user => {
        // Add computed name field for backward compatibility
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        const patientWithName = {
          ...user,
          name: user.name || fullName || user.email
        };
        return patientWithName;
      });

    return c.json({
      patients
    });
  } catch (error) {
    console.log('Get patients error:', error);
    return c.json({
      error: 'Failed to fetch patients'
    }, 500);
  }
});

// Walk-in patient creation endpoint
app.post('/make-server-c89a26e4/walk-in-patient', async (c) => {
  try {
    const { name, phone, email, staffEmail } = await c.req.json();
    
    if (!name || !email || !staffEmail) {
      return c.json({
        error: 'Name, email, and staff email are required'
      }, 400);
    }

    // Check if patient already exists
    const existingUser = await kv.get(`dcms:user:${email}`);
    if (existingUser) {
      return c.json({
        error: 'A patient with this email already exists'
      }, 409);
    }

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create walk-in patient
    const patientId = `patient-${crypto.randomUUID()}`;
    const patient = {
      id: patientId,
      email,
      first_name: firstName,
      last_name: lastName,
      name,
      phone: phone || null,
      role: 'patient',
      canLogin: false,
      password: null,
      registrationType: 'anonymous',
      isWalkIn: true,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      createdBy: staffEmail
    };

    await kv.set(`dcms:user:${email}`, patient);
    console.log(`Created walk-in patient: ${email} by staff: ${staffEmail}`);

    return c.json({
      patient
    });
  } catch (error) {
    console.log('Create walk-in patient error:', error);
    return c.json({
      error: 'Failed to create walk-in patient'
    }, 500);
  }
});

// Profile update endpoint
app.put('/make-server-c89a26e4/profile/:email', async (c) => {
  try {
    const email = c.req.param('email');
    const updates = await c.req.json();
    
    const existingUser = await kv.get(`dcms:user:${email}`);
    if (!existingUser) {
      return c.json({
        error: 'User not found'
      }, 404);
    }

    const updatedUser = {
      ...existingUser,
      ...updates,
      lastUpdatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:user:${email}`, updatedUser);

    return c.json({
      user: updatedUser
    });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({
      error: 'Failed to update profile'
    }, 500);
  }
});

// Patient validation endpoint
app.post('/make-server-c89a26e4/patients/validate', async (c) => {
  try {
    const { email, firstName, lastName, phone } = await c.req.json();
    
    if (!email) {
      return c.json({
        error: 'Email is required'
      }, 400);
    }

    // Check if user exists by email
    const existingUser = await kv.get(`dcms:user:${email}`);
    
    if (!existingUser) {
      // User doesn't exist - can proceed with booking (user will be created during booking)
      return c.json({
        canBook: true,
        hasOutstandingBalance: false,
        existingUser: null,
        message: 'New patient - ready to book'
      });
    }

    // User exists - check if they can login (registered user)
    if (existingUser.canLogin) {
      return c.json({
        canBook: false,
        hasOutstandingBalance: false,
        existingUser,
        message: 'This email is already registered. Please log in to continue.'
      });
    }

    // Check for outstanding balances
    const allBills = await kv.getByPrefix('dcms:bill:');
    const userBills = allBills.filter(bill => 
      bill.patientEmail === email && bill.outstandingBalance > 0
    );
    
    const totalOutstanding = userBills.reduce((sum, bill) => sum + bill.outstandingBalance, 0);
    
    if (totalOutstanding > 0) {
      return c.json({
        canBook: false,
        hasOutstandingBalance: true,
        outstandingAmount: totalOutstanding,
        existingUser,
        message: `Outstanding balance of ₱${totalOutstanding.toLocaleString()}`
      });
    }

    // Check if data matches existing record
    const dataMatches = 
      existingUser.first_name === firstName &&
      existingUser.last_name === lastName &&
      (existingUser.phone === phone || (!existingUser.phone && !phone));

    if (!dataMatches) {
      // Data doesn't match - use existing data
      return c.json({
        canBook: true,
        hasOutstandingBalance: false,
        existingUser,
        shouldUseExistingData: true,
        message: 'We found an existing patient record for this email. Booking will proceed under that record.'
      });
    }

    // Everything matches - proceed with booking
    return c.json({
      canBook: true,
      hasOutstandingBalance: false,
      existingUser,
      message: 'Patient validated successfully'
    });

  } catch (error) {
    console.log('Patient validation error:', error);
    return c.json({
      error: 'Failed to validate patient'
    }, 500);
  }
});

// Medical Records Endpoints
// Get medical records by patient
app.get('/make-server-c89a26e4/medical-records', async (c) => {
  try {
    const patientEmail = c.req.query('patientEmail');
    
    if (!patientEmail) {
      return c.json({ error: 'Patient email is required' }, 400);
    }

    const allRecords = await kv.getByPrefix('dcms:medical_record:');
    const patientRecords = allRecords.filter(record => 
      record.patientEmail === patientEmail && record.isActive
    );

    // Group records by type
    const medicalInfo = patientRecords.filter(record => record.type === 'medical_info');
    const allergies = patientRecords.filter(record => record.type === 'allergy');
    const medications = patientRecords.filter(record => record.type === 'medication');

    // Attach files to each record
    const allFiles = await kv.getByPrefix('dcms:file:');
    for (const record of patientRecords) {
      record.files = allFiles.filter(file => file.recordId === record.id && file.isActive);
    }

    return c.json({
      medicalInfo,
      allergies,
      medications
    });
  } catch (error) {
    console.log('Get medical records error:', error);
    return c.json({ error: 'Failed to fetch medical records' }, 500);
  }
});

// Create medical record
app.post('/make-server-c89a26e4/medical-records', async (c) => {
  try {
    const body = await c.req.json();
    const {
      patientId,
      patientEmail,
      type,
      staffId,
      staffEmail,
      staffName,
      dateRecorded,
      ...recordData
    } = body;

    const recordId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const record = {
      id: recordId,
      patientId,
      patientEmail,
      type,
      staffId,
      staffEmail,
      staffName,
      dateRecorded,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...recordData
    };

    await kv.set(`dcms:medical_record:${recordId}`, record);

    return c.json({ record });
  } catch (error) {
    console.log('Create medical record error:', error);
    return c.json({ error: 'Failed to create medical record' }, 500);
  }
});

// Update medical record
app.put('/make-server-c89a26e4/medical-records/:id', async (c) => {
  try {
    const recordId = c.req.param('id');
    const updates = await c.req.json();

    const existingRecord = await kv.get(`dcms:medical_record:${recordId}`);
    if (!existingRecord) {
      return c.json({ error: 'Medical record not found' }, 404);
    }

    const updatedRecord = {
      ...existingRecord,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:medical_record:${recordId}`, updatedRecord);

    return c.json({ record: updatedRecord });
  } catch (error) {
    console.log('Update medical record error:', error);
    return c.json({ error: 'Failed to update medical record' }, 500);
  }
});

// Delete medical record (soft delete)
app.delete('/make-server-c89a26e4/medical-records/:id', async (c) => {
  try {
    const recordId = c.req.param('id');
    
    const existingRecord = await kv.get(`dcms:medical_record:${recordId}`);
    if (!existingRecord) {
      return c.json({ error: 'Medical record not found' }, 404);
    }

    const updatedRecord = {
      ...existingRecord,
      isActive: false,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:medical_record:${recordId}`, updatedRecord);

    return c.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.log('Delete medical record error:', error);
    return c.json({ error: 'Failed to delete medical record' }, 500);
  }
});

// Correction Requests Endpoints
// Get correction requests
app.get('/make-server-c89a26e4/correction-requests', async (c) => {
  try {
    const patientEmail = c.req.query('patientEmail');
    
    const allRequests = await kv.getByPrefix('dcms:correction_request:');
    
    let filteredRequests = allRequests;
    if (patientEmail) {
      filteredRequests = allRequests.filter(request => request.patientEmail === patientEmail);
    }

    // Attach files to each request
    const allFiles = await kv.getByPrefix('dcms:file:');
    for (const request of filteredRequests) {
      request.reviewFiles = allFiles.filter(file => 
        file.recordId === request.id && 
        file.recordType === 'correction_request' && 
        file.isActive
      );
    }

    return c.json({ requests: filteredRequests });
  } catch (error) {
    console.log('Get correction requests error:', error);
    return c.json({ error: 'Failed to fetch correction requests' }, 500);
  }
});

// Create correction request
app.post('/make-server-c89a26e4/correction-requests', async (c) => {
  try {
    const body = await c.req.json();
    const {
      recordId,
      recordType,
      patientId,
      patientEmail,
      patientName,
      originalRecord,
      suggestedChanges
    } = body;

    const requestId = `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request = {
      id: requestId,
      recordId,
      recordType,
      patientId,
      patientEmail,
      patientName,
      originalRecord,
      suggestedChanges,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:correction_request:${requestId}`, request);

    // Create notification for staff
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notification = {
      id: notificationId,
      type: 'correction_request',
      title: 'New Correction Request',
      message: `${patientName} has requested a correction to their ${recordType.replace('_', ' ')} record`,
      data: request,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`dcms:notification:${notificationId}`, notification);

    return c.json({ request });
  } catch (error) {
    console.log('Create correction request error:', error);
    return c.json({ error: 'Failed to create correction request' }, 500);
  }
});

// Review correction request (approve/deny)
app.put('/make-server-c89a26e4/correction-requests/:id', async (c) => {
  try {
    const requestId = c.req.param('id');
    const body = await c.req.json();
    const { action, reviewNotes, reviewedBy } = body;

    const existingRequest = await kv.get(`dcms:correction_request:${requestId}`);
    if (!existingRequest) {
      return c.json({ error: 'Correction request not found' }, 404);
    }

    const updatedRequest = {
      ...existingRequest,
      status: action,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      reviewNotes,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`dcms:correction_request:${requestId}`, updatedRequest);

    // If approved, create new version of record and mark old as discarded
    if (action === 'approve') {
      const originalRecord = existingRequest.originalRecord;
      const newRecordId = `${originalRecord.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Apply suggested changes to create new record
      const newRecord = { ...originalRecord };
      for (const change of existingRequest.suggestedChanges) {
        newRecord[change.field] = change.suggestedValue;
      }
      
      newRecord.id = newRecordId;
      newRecord.updatedAt = new Date().toISOString();
      
      await kv.set(`dcms:medical_record:${newRecordId}`, newRecord);
      
      // Mark old record as inactive
      const oldRecord = { ...originalRecord, isActive: false, updatedAt: new Date().toISOString() };
      await kv.set(`dcms:medical_record:${originalRecord.id}`, oldRecord);
    }

    return c.json({ request: updatedRequest });
  } catch (error) {
    console.log('Review correction request error:', error);
    return c.json({ error: 'Failed to review correction request' }, 500);
  }
});

// Notifications Endpoints
// Get notifications
app.get('/make-server-c89a26e4/notifications', async (c) => {
  try {
    const allNotifications = await kv.getByPrefix('dcms:notification:');
    
    // Sort by creation date (newest first)
    const sortedNotifications = allNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ notifications: sortedNotifications });
  } catch (error) {
    console.log('Get notifications error:', error);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark notification as read
app.put('/make-server-c89a26e4/notifications/:id/read', async (c) => {
  try {
    const notificationId = c.req.param('id');
    
    const existingNotification = await kv.get(`dcms:notification:${notificationId}`);
    if (!existingNotification) {
      return c.json({ error: 'Notification not found' }, 404);
    }

    const updatedNotification = {
      ...existingNotification,
      isRead: true
    };

    await kv.set(`dcms:notification:${notificationId}`, updatedNotification);

    return c.json({ notification: updatedNotification });
  } catch (error) {
    console.log('Mark notification as read error:', error);
    return c.json({ error: 'Failed to mark notification as read' }, 500);
  }
});

// File Management Endpoints
// Upload file
app.post('/make-server-c89a26e4/files', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const recordId = formData.get('recordId') as string;
    const recordType = formData.get('recordType') as string;
    const patientId = formData.get('patientId') as string;
    const patientEmail = formData.get('patientEmail') as string;
    const uploadedBy = formData.get('uploadedBy') as string;
    const uploadedByName = formData.get('uploadedByName') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type and size
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'File type not allowed' }, 400);
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return c.json({ error: 'File size too large (max 10MB)' }, 400);
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${fileId}_${file.name}`;
    
    // Convert file to base64 for storage (in a real app, use proper file storage)
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    const fileRecord = {
      id: fileId,
      recordId,
      recordType,
      patientId,
      patientEmail,
      fileName,
      originalFileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedBy,
      uploadedByName,
      uploadedAt: new Date().toISOString(),
      description: description || '',
      isActive: true,
      fileData: base64 // In production, store in proper file storage
    };

    await kv.set(`dcms:file:${fileId}`, fileRecord);

    // Return file info without the actual data
    const { fileData, ...fileInfo } = fileRecord;
    return c.json({ file: fileInfo });
  } catch (error) {
    console.log('Upload file error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Get files
app.get('/make-server-c89a26e4/files', async (c) => {
  try {
    const patientId = c.req.query('patientId');
    const recordId = c.req.query('recordId');
    const recordType = c.req.query('recordType');

    let allFiles = await kv.getByPrefix('dcms:file:');
    allFiles = allFiles.filter(file => file.isActive);

    if (patientId) {
      allFiles = allFiles.filter(file => file.patientId === patientId);
    }
    if (recordId) {
      allFiles = allFiles.filter(file => file.recordId === recordId);
    }
    if (recordType) {
      allFiles = allFiles.filter(file => file.recordType === recordType);
    }

    // Remove file data from response
    const filesInfo = allFiles.map(file => {
      const { fileData, ...fileInfo } = file;
      return fileInfo;
    });

    return c.json({ files: filesInfo });
  } catch (error) {
    console.log('Get files error:', error);
    return c.json({ error: 'Failed to fetch files' }, 500);
  }
});

// Download file
app.get('/make-server-c89a26e4/files/:id', async (c) => {
  try {
    const fileId = c.req.param('id');
    
    const file = await kv.get(`dcms:file:${fileId}`);
    if (!file || !file.isActive) {
      return c.json({ error: 'File not found' }, 404);
    }

    // Convert base64 back to binary
    const binaryData = atob(file.fileData);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    return new Response(bytes, {
      headers: {
        'Content-Type': file.fileType,
        'Content-Disposition': `attachment; filename="${file.originalFileName}"`
      }
    });
  } catch (error) {
    console.log('Download file error:', error);
    return c.json({ error: 'Failed to download file' }, 500);
  }
});

// Delete file
app.delete('/make-server-c89a26e4/files/:id', async (c) => {
  try {
    const fileId = c.req.param('id');
    
    const existingFile = await kv.get(`dcms:file:${fileId}`);
    if (!existingFile) {
      return c.json({ error: 'File not found' }, 404);
    }

    const updatedFile = {
      ...existingFile,
      isActive: false
    };

    await kv.set(`dcms:file:${fileId}`, updatedFile);

    return c.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.log('Delete file error:', error);
    return c.json({ error: 'Failed to delete file' }, 500);
  }
});

// Catch-all for undefined routes
app.all('*', (c)=>{
  return c.json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /make-server-c89a26e4/test',
      'GET /make-server-c89a26e4/health',
      'POST /make-server-c89a26e4/auth/signin',
      'POST /make-server-c89a26e4/auth/signup',
      'GET /make-server-c89a26e4/appointments',
      'POST /make-server-c89a26e4/appointments',
      'PUT /make-server-c89a26e4/appointments/:id',
      'PUT /make-server-c89a26e4/appointments/:id/confirm',
      'PUT /make-server-c89a26e4/appointments/:id/status',
      'POST /make-server-c89a26e4/appointments/:id/notes',
      'GET /make-server-c89a26e4/appointments/:id/notes',
      'POST /make-server-c89a26e4/appointments/:id/service-entry',
      'POST /make-server-c89a26e4/available-slots',

      'GET /make-server-c89a26e4/patients',
      'GET /make-server-c89a26e4/patients/:id',
      'GET /make-server-c89a26e4/dentists',
      'GET /make-server-c89a26e4/services',
      'POST /make-server-c89a26e4/services',
      'PUT /make-server-c89a26e4/services/:id',
      'DELETE /make-server-c89a26e4/services/:id',
      'GET /make-server-c89a26e4/inventory',
      'POST /make-server-c89a26e4/inventory',
      'PUT /make-server-c89a26e4/inventory/:id',
      'POST /make-server-c89a26e4/inventory/:id/restock',
      'DELETE /make-server-c89a26e4/inventory/:id',
      'GET /make-server-c89a26e4/inventory/:id/restock-history',
      'GET /make-server-c89a26e4/patients',
      'POST /make-server-c89a26e4/walk-in-patient',
      'PUT /make-server-c89a26e4/profile/:email',
      'POST /make-server-c89a26e4/admin/users',
      'GET /make-server-c89a26e4/admin/users',
      'POST /make-server-c89a26e4/patients/validate',
      'GET /make-server-c89a26e4/medical-records',
      'POST /make-server-c89a26e4/medical-records',
      'PUT /make-server-c89a26e4/medical-records/:id',
      'DELETE /make-server-c89a26e4/medical-records/:id',
      'GET /make-server-c89a26e4/correction-requests',
      'POST /make-server-c89a26e4/correction-requests',
      'PUT /make-server-c89a26e4/correction-requests/:id',
      'GET /make-server-c89a26e4/notifications',
      'PUT /make-server-c89a26e4/notifications/:id/read',
      'POST /make-server-c89a26e4/files',
      'GET /make-server-c89a26e4/files',
      'GET /make-server-c89a26e4/files/:id',
      'DELETE /make-server-c89a26e4/files/:id'
    ]
  }, 404);
});

export default app;*/