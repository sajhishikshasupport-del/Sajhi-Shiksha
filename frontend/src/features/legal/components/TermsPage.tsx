import { Box, Typography, Button } from '@mui/material';
import { FONT_HEADING, FONT_BODY, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

interface TermsPageProps {
    onNavigate: (route: string) => void;
}

function TermsPage({ onNavigate }: TermsPageProps): React.ReactElement {
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const sections = [
        {
            title: '1. Acceptance of Terms',
            body: 'By accessing and using sajhishiksha.in (the "Website"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the Website.',
        },
        {
            title: '2. About the Website',
            body: 'Sajhi Shiksha is a free, open-access educational resource-sharing platform providing study materials, question papers, practice worksheets, and administrative formats for students and teachers across India. The Website does not require registration or login to access resources.',
        },
        {
            title: '3. Use of Content',
            body: 'All resources available on this Website are intended for personal, educational, and non-commercial use. You may download and use the materials for learning and teaching purposes. You may not:\n\n(a) Reproduce or distribute content for commercial purposes without permission\n(b) Modify, adapt, or create derivative works for commercial gain\n(c) Use automated tools to scrape or mass-download content\n(d) Claim ownership of content shared by contributors',
        },
        {
            title: '4. Intellectual Property',
            body: 'The Website design, layout, logo, and original content are the property of Sajhi Shiksha. Resource materials shared by contributors remain the intellectual property of their respective creators. We respect intellectual property rights and expect our users to do the same.',
        },
        {
            title: '5. User-Contributed Content',
            body: 'Users who contribute resources to Sajhi Shiksha are responsible for ensuring they have the right to share the content. We do not verify ownership of contributed materials. If you believe any content on this Website infringes your copyright, please contact us at sajhishikshasupport@gmail.com and we will remove it promptly.',
        },
        {
            title: '6. Third-Party Links',
            body: 'Our Website contains links to external websites and third-party resources (such as Google Drive, YouTube, etc.). We are not responsible for the content, privacy policies, or practices of these external sites. We recommend you review the terms and policies of any third-party websites you visit.',
        },
        {
            title: '7. Advertisements',
            body: 'This Website may display advertisements served by Google AdSense or other third-party advertising networks. We do not control the specific ads displayed and are not responsible for the content of advertisements. Interactions with ads are governed by the respective advertiser\'s terms and policies.',
        },
        {
            title: '8. Disclaimers',
            body: 'The resources and materials provided on this Website are for general informational and educational purposes only. We make no warranties regarding accuracy, completeness, or reliability of the content. Any reliance on such information is at your own risk.\n\nWe do not guarantee that the Website will be available at all times, free from errors, or secure from unauthorized access.',
        },
        {
            title: '9. Limitation of Liability',
            body: 'Sajhi Shiksha and its team shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of or inability to use the Website. This includes but is not limited to loss of data, academic loss, or any other damages.',
        },
        {
            title: '10. Prohibited Activities',
            body: 'You agree not to: (a) Use the Website for any unlawful purpose, (b) Attempt to gain unauthorized access to the Website or its systems, (c) Upload or distribute viruses or malicious code, (d) Impersonate another person or entity, (e) Engage in any activity that disrupts the Website.',
        },
        {
            title: '11. Changes to Terms',
            body: 'We reserve the right to modify these Terms and Conditions at any time. Updated terms will be posted on this page with a revised date. Continued use of the Website after changes constitutes acceptance of the updated terms.',
        },
        {
            title: '12. Contact',
            body: 'For questions or concerns regarding these Terms and Conditions, please contact us at: sajhishikshasupport@gmail.com',
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
                    Terms & Conditions
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
                        Please read these Terms and Conditions carefully before using Sajhi Shiksha. By accessing this Website, you agree to be bound by these terms.
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
                        onClick={() => onNavigate('/privacy-policy')}
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
                        View Privacy Policy
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

export default TermsPage;
