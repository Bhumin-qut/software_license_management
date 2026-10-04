const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Software = require('../models/Software');
const SoftwareVersion = require('../models/SoftwareVersion');
const License = require('../models/License');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

class DatabaseSeeder {
  at(date, hours, minutes) {
    const value = new Date(`${date}T12:00:00`);
    if (hours !== undefined) value.setHours(hours, minutes, 0, 0);
    return value;
  }

  async run() {
    if ((await User.countDocuments()) > 0) return;

    const passwordHash = await bcrypt.hash('Password123', 10);
    const users = await this.createUsers(passwordHash);
    const software = await this.createSoftware();
    const versions = await this.createVersions(software);
    await this.createLicenses(users, software, versions);
    await this.createFeedback(users, versions);
    await this.createNotifications(users);

    console.log('Seeded database.');
    console.log('Admin login: admin@company.com / Password123');
    console.log('User login:  abc@gmail.com / Password123');
  }

  async createUsers(passwordHash) {
    const userSeed = [
      ['Sarah Jenkins', 's.jenkins@company.com', 'admin', 'active'],
      ['David Chen', 'd.chen@company.com', 'user', 'active'],
      ['Marcus Vance', 'm.vance@company.com', 'user', 'blocked'],
      ['Elena Rostova', 'e.rostova@company.com', 'admin', 'active'],
      ['James Wilson', 'j.wilson@company.com', 'user', 'active'],
      ['Amira Patel', 'a.patel@company.com', 'user', 'blocked'],
      ['Liam Gallagher', 'l.gallagher@enterprise.com', 'user', 'active'],
      ['Devon Brooks', 'd.brooks@enterprise.com', 'user', 'active'],
      ['Aria Montgomery', 'a.montgomery@enterprise.com', 'user', 'active'],
      ['John Doe', 'abc@gmail.com', 'user', 'active'],
      ['System Admin', 'admin@company.com', 'admin', 'active'],
    ];

    const users = {};
    for (let index = 0; index < userSeed.length; index += 1) {
      const [fullName, email, role, status] = userSeed[index];
      users[email] = await User.create({
        full_name: fullName,
        email,
        password_hash: passwordHash,
        role,
        status,
        created_at: new Date(Date.now() - (userSeed.length - index) * 86400000),
      });
    }
    return users;
  }

  async createSoftware() {
    const softwareSeed = [
      ['CodeSphere Studio Enterprise', '2024-01-15'],
      ['KubeNexus Fleet Orchestrator', '2024-03-22'],
      ['DataStream Vector Analytics', '2024-06-10'],
      ['ArmorGate Guard Sentinel', '2024-08-04'],
      ['PixelDraft CAD Suite', '2024-11-19'],
      ['AgileSprint Matrix Project', '2025-01-05'],
      ['HyperGrid Sim Premium', '2025-04-02'],
      ['SecOps Guard Enterprise', '2025-06-18'],
    ];

    const software = {};
    for (const [name, created] of softwareSeed) {
      software[name] = await Software.create({ software_name: name, created_at: this.at(created) });
    }
    return software;
  }

  async createVersions(software) {
    const versionSeed = [
      ['CodeSphere Studio Enterprise', 'v4.0.2', '2026-02-15', 'Implemented distributed build cache and native Apple Silicon debugging bridge.'],
      ['CodeSphere Studio Enterprise', 'v2.1.0', '2026-01-10', 'Long-term support release for enterprise workstation deployment.'],
      ['KubeNexus Fleet Orchestrator', 'v4.1.0', '2026-03-01', 'Added multicluster orchestration telemetry and RBAC token rotation.'],
      ['DataStream Vector Analytics', 'v1.8.5', '2026-01-20', 'Optimized memory indexing throughput and resolved Kafka partition consumer lag.'],
      ['ArmorGate Guard Sentinel', 'v3.2.0', '2025-11-18', 'Zero-trust mutual TLS enforcement and automated egress vulnerability scanning.'],
      ['PixelDraft CAD Suite', 'v5.0.1', '2026-02-28', 'Direct GPU viewport hardware acceleration and DXF format export bugfix.'],
      ['PixelDraft CAD Suite', 'v2026.4', '2026-04-12', 'Frontend CAD drafting and industrial chassis specifications for client delivery.'],
      ['AgileSprint Matrix Project', 'v2.4.4', '2025-12-10', 'Webhook integration with Jira / GitHub issues and sprint burndown export.'],
      ['HyperGrid Sim Premium', 'v3.12.0', '2026-02-02', 'Finite element stress testing on hypothetical cooling fixtures.'],
      ['SecOps Guard Enterprise', 'v5.2.0', '2026-03-12', 'Zero-trust credential validation across cross-regional staging VPCs.'],
    ];

    const versions = {};
    for (const [name, number, date, notes] of versionSeed) {
      versions[`${name}::${number}`] = await SoftwareVersion.create({
        software: software[name]._id,
        version_number: number,
        release_notes: notes,
        release_date: this.at(date),
      });
    }
    return versions;
  }

  async createLicenses(users, software, versions) {
    const licenseSeed = [
      ['abc@gmail.com', 'CodeSphere Studio Enterprise', 'v2.1.0', 'Workstation IDE for the platform team.', 'Approved', '2026-02-15', '2026-02-16', '2027-02-16'],
      ['abc@gmail.com', 'KubeNexus Fleet Orchestrator', 'v4.1.0', 'Cluster operations access for the infrastructure group.', 'Approved', '2026-03-01', '2026-03-02', '2027-03-02'],
      ['abc@gmail.com', 'DataStream Vector Analytics', 'v1.8.5', 'Pipeline monitoring for the analytics squad.', 'Pending', '2026-03-10', null, null],
      ['abc@gmail.com', 'ArmorGate Guard Sentinel', 'v3.2.0', 'Security tooling for the endpoint review.', 'Expired', '2025-01-10', '2025-01-12', '2027-02-02'],
      ['abc@gmail.com', 'PixelDraft CAD Suite', 'v5.0.1', 'CAD review for facility drawings.', 'Rejected', '2026-02-20', '2026-02-22', null],
      ['abc@gmail.com', 'AgileSprint Matrix Project', 'v2.4.4', 'Sprint tracking for product delivery.', 'Approved', '2025-06-01', '2025-06-02', '2026-06-02'],
      ['s.jenkins@company.com', 'CodeSphere Studio Enterprise', 'v2.1.0', 'Required for Q4 cloud migration pipeline development and microservice routing overhaul.', 'Pending', '2026-10-24', null, null],
      ['l.gallagher@enterprise.com', 'KubeNexus Fleet Orchestrator', 'v4.1.0', 'Cluster telemetry deployment across distributed edge nodes.', 'Pending', '2026-10-24', null, null],
      ['e.rostova@company.com', 'DataStream Vector Analytics', 'v1.8.5', 'Vector embedding transformations for internal documentation indexing search engine.', 'Approved', '2026-10-23', '2026-10-23', '2027-10-23'],
      ['m.vance@company.com', 'PixelDraft CAD Suite', 'v2026.4', 'Frontend CAD drafting and industrial chassis specifications for client delivery.', 'Approved', '2026-10-23', '2026-10-23', '2027-10-23'],
      ['d.brooks@enterprise.com', 'HyperGrid Sim Premium', 'v3.12.0', 'Finite element stress testing on hypothetical cooling fixtures.', 'Rejected', '2026-10-22', '2026-10-22', null],
      ['a.montgomery@enterprise.com', 'SecOps Guard Enterprise', 'v5.2.0', 'Zero-trust credential validation across cross-regional staging VPCs.', 'Pending', '2026-10-24', null, null],
    ];

    for (const [email, name, number, reason, status, requested, reviewed, expires] of licenseSeed) {
      await License.create({
        user: users[email]._id,
        assigned_software: software[name]._id,
        version_number: versions[`${name}::${number}`]._id,
        reason,
        status,
        requested_at: this.at(requested),
        reviewed_at: reviewed ? this.at(reviewed) : null,
        expires_at: expires ? this.at(expires) : null,
      });
    }
  }

  async createFeedback(users, versions) {
    const feedbackSeed = [
      ['abc@gmail.com', 'DataStream Vector Analytics', 'v1.8.5', 5, 'The pipeline optimization updates drastically improved dashboard response times. Real-time metric export is exceptional.', '2026-02-22', 9, 15],
      ['abc@gmail.com', 'KubeNexus Fleet Orchestrator', 'v4.1.0', 3, 'Authentication token cache expires prematurely during intermittent VPN renegotiations, forcing re-login in multi-cluster environments.', '2026-02-14', 18, 40],
      ['abc@gmail.com', 'ArmorGate Guard Sentinel', 'v3.2.0', 5, 'Automated rotation for client certificates resolved our compliance verification bottleneck. Highly reliable build with zero downtime.', '2026-02-05', 11, 4],
    ];

    for (const [email, name, number, rating, comments, date, hours, minutes] of feedbackSeed) {
      await Feedback.create({
        user: users[email]._id,
        version: versions[`${name}::${number}`]._id,
        rating,
        comments,
        created_at: this.at(date, hours, minutes),
      });
    }
  }

  async createNotifications(users) {
    const today = new Date();
    today.setHours(9, 15, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(16, 30, 0, 0);

    const messages = [
      ['Autodesk AutoCAD 2024 license seat ACAD-9921-XRT expires tomorrow at 11:59 PM. Please submit a renewal request to avoid software interruption.', today],
      ['JetBrains All Products Pack subscription expires in 5 days (March 28, 2025). 4 unallocated backup keys available in enterprise pool.', yesterday],
      ['Your request for Figma Enterprise Design Organization Editor access has been approved and SSO provisioned.', this.at('2025-03-21', 11, 20)],
      ['Quarterly license usage audit completed. All 18 active developer workstations verified successfully.', this.at('2025-03-15', 10, 0)],
    ];

    const docs = [];
    ['admin@company.com', 'abc@gmail.com'].forEach((email) => {
      messages.forEach(([message, created]) => {
        docs.push({ user: users[email]._id, message, read_at: false, created_at: created });
      });
    });
    await Notification.insertMany(docs);
  }
}

module.exports = DatabaseSeeder;
