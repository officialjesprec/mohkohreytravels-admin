# Admin Dashboard UI Refinement Task Plan

## Phase 1: Standardize Modal Experience (COMPLETED)
- [x] **Modal Consistency**: Update `src/components/Modal.tsx` for responsive sizing and max-height constraints.
- [x] **Scrollbar Support**: Add custom styles to `src/index.css` for cross-browser scrollbar aesthetics.
- [x] **Viewport Fit**: Ensure modals don't overflow the screen; implement vertical scrolling for long forms.

## Phase 2: Missing Creation Modals (COMPLETED)
- [x] **Visa Management**: Add "New Application" modal with relevant fields.
- [x] **Study Abroad**: Add "New Student Admission" modal.
- [x] **Passport Service**: Add "New Passport Record" modal.

## Phase 3: Service-Specific Branding (COMPLETED)
- [x] **Visa (Green)**: Apply `#2BB673` branding.
- [x] **Flights (Dark Grey)**: Apply `#1F1F1F` branding to Bookings.
- [x] **Study Abroad (Blue)**: Apply `#0070F3` branding.
- [x] **Passport (Teal)**: Apply `#008080` branding.

## Current Status
All UI refinement phases and core security measures are complete. Modals are now responsive and standardized, missing creation forms have been added, service-specific branding has been synchronized, and an inactivity timeout (5 mins) has been implemented globaly.

## Phase 4: Final Cleanup & Security (COMPLETED)
- [x] Audit responsive layouts for modals across mobile devices.
- [x] Implement "Inactivity Logout" logic (5-minute timeout).
