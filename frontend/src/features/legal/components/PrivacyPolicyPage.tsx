import { Box, Typography, Button } from '@mui/material';
import { FONT_HEADING, FONT_BODY, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

interface PrivacyPolicyPageProps {
    onNavigate: (route: string) => void;
}

function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps): React.ReactElement {
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const sections = [
        {
            title: '1. Introduction',
            body: 'Sajhi Shiksha ("we", "us", or "our") operates sajhishiksha.in (the "Website"). This Privacy Policy explains how we collect, use, and protect your information when you visit our Website. By using the Website, you agree to the practices described in this Privacy Policy.',
        },
        {
            title: '2. Information We Collect',
            body: 'We do not require you to create an account or provide personal information to access or download resources from our Website. However, we may collect non-personal information such as browser type, device information, pages visited, and general usage data through Google Analytics and similar tools.',
        },
        {
            title: '3. Cookies and Tracking Technologies',
            body: 'Our Website uses cookies and similar tracking technologies to enhance user experience and analyze website traffic. Cookies are small data files stored on your device. You can configure your browser to refuse cookies, but some features of the Website may not function properly.',
        },
        {
            title: '4. Google AdSense and Third-Party Advertising',
            body: 'We may use Google AdSense to display advertisements on our Website. Google AdSense uses cookies (including the DoubleClick DART cookie) to serve ads based on your prior visits to this and other websites. Google may use this information to provide personalized advertisements.\n\nThird-party vendors and advertising partners may also use cookies and tracking technologies to collect information about your visits to our Website and other websites. This information is used to provide more relevant ads and measure campaign effectiveness.\n\nYou can opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads) or by using the Digital Advertising Alliance opt-out tool (https://www.aboutads.info/choices/).',
        },
        {
            title: '5. Google Analytics',
            body: 'We use Google Analytics to understand how visitors interact with our Website. Google Analytics collects anonymous usage data such as page views, session duration, and geographic location. This data is used to improve Website content and performance. You can review Google Privacy Policy at https://policies.google.com/privacy.',
        },
        {
            title: '6. How We Use Your Information',
            body: 'We use the collected information to: (a) analyze Website usage and trends, (b) improve Website content and user experience, (c) display relevant advertisements, (d) monitor and prevent fraud or abuse, and (e) comply with legal obligations.',
        },
        {
            title: '7. Data Sharing',
            body: 'We do not sell, trade, or rent your information to third parties. We may share aggregated, non-personal data with our advertising partners and analytics providers. This data does not identify individual users.',
        },
        {
            title: '8. Children\'s Privacy',
            body: 'Our Website is designed for educational purposes and is accessible to users of all ages, including students. We do not knowingly collect personal information from children. If you believe a child has provided personal information to us, please contact us so we can delete it.',
        },
        {
            title: '9. Data Security',
            body: 'We implement reasonable security measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet is 100% secure.',
        },
        {
            title: '10. Your Rights',
            body: 'You have the right to: (a) opt out of cookies by adjusting your browser settings, (b) opt out of personalized advertising, (c) request deletion of any personal information you may have shared with us via email.',
        },
        {
            title: '11. Changes to This Privacy Policy',
            body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.',
        },
        {
            title: '12. Contact Us',
            body: 'If you have questions or concerns about this Privacy Policy, please contact us at: sajhishikshasupport@gmail.com',
        },
    ];

    return (
        <Box
            sx={{
                maxWidth: MAX_CONTENT_WIDTH,
                mx: 'auto',
                px: { xs: 2, md: 4 },
                py: { xs: 4, md: 6 },
            }}
        >
            <Box
                sx={{
                    border: `2px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                    p: { xs: 3, md: 5 },
                    bgcolor: 'var(--color-bg)',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        mb: 1,
                    }}
                >
                    Privacy Policy
                </Typography>
                <Typography
                    sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        mb: 4,
                    }}
                >
                    Last updated: September 12, 2026
                </Typography>

                <Box
                    sx={{
                        bgcolor: 'var(--color-bg-secondary)',
                        border: `1px solid ${borderColor}`,
                        p: 3,
                        mb: 4,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: FONT_BODY,
                            fontSize: '0.95rem',
                            lineHeight: 1.75,
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Sajhi Shiksha is committed to protecting your privacy. This Privacy Policy explains what data we collect, why we collect it, and how you can control your personal information.
                    </Typography>
                </Box>

                {sections.map((section) => (
                    <Box key={section.title} sx={{ mb: 4 }}>
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 700,
                                fontSize: { xs: '1.1rem', md: '1.25rem' },
                                mb: 1,
                                pb: 0.5,
                                borderBottom: `2px solid var(--color-yellow)`,
                                display: 'inline-block',
                            }}
                        >
                            {section.title}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: FONT_BODY,
                                fontSize: '0.95rem',
                                lineHeight: 1.8,
                                color: 'var(--color-text-secondary)',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {section.body}
                        </Typography>
                    </Box>
                ))}

                <Box
                    sx={{
                        mt: 6,
                        pt: 4,
                        borderTop: `2px solid ${borderColor}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => onNavigate('/terms')}
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            px: 3,
                            py: 1.5,
                            bgcolor: 'var(--color-yellow)',
                            color: '#1A1A1A',
                            border: `2px solid ${borderColor}`,
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                            '&:hover': {
                                bgcolor: 'var(--color-bg-secondary)',
                                transform: 'translate(-1px, -1px)',
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        View Terms & Conditions
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => onNavigate('/')}
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            px: 3,
                            py: 1.5,
                            bgcolor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            border: `2px solid ${borderColor}`,
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                            '&:hover': {
                                bgcolor: 'var(--color-bg-secondary)',
                                transform: 'translate(-1px, -1px)',
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        Go Back Home
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default PrivacyPolicyPage;
