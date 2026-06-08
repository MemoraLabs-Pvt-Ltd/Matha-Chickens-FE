import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Building,
  Shield,
  Calendar,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoMetal from '@/assets/LogoMetal.png';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'definitions', label: 'Interpretation & Definitions' },
    { id: 'collecting-data', label: 'Collecting & Using Personal Data' },
    { id: 'use-of-data', label: 'Use of Your Personal Data' },
    { id: 'retention', label: 'Retention of Your Personal Data' },
    { id: 'transfer', label: 'Transfer of Your Personal Data' },
    { id: 'delete-data', label: 'Delete Your Personal Data' },
    { id: 'disclosure', label: 'Disclosure of Personal Data' },
    { id: 'security', label: 'Security of Your Personal Data' },
    { id: 'children', label: "Children's Privacy" },
    { id: 'external-links', label: 'Links to Other Websites' },
    { id: 'changes', label: 'Changes to this Policy' },
    { id: 'contact-us', label: 'Contact Us' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className='flex min-h-screen w-full flex-col bg-background text-foreground'>
      {/* Sticky Premium Header */}
      <header className='sticky top-0 z-50 border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-md'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6'>
          <Link to='/' className='flex items-center gap-2'>
            <img
              src={LogoMetal}
              alt='Matha Chickens'
              className='h-10 w-[85px] rounded-lg object-contain sm:h-12'
            />
          </Link>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 font-semibold text-foreground/80 hover:text-primary'
            asChild
          >
            <Link to='/'>
              <ArrowLeft className='size-4' />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Elegant Hero Banner */}
      <section className='relative overflow-hidden bg-linear-to-br from-[#E7000B] via-[#c9000a] to-[#8c0606] px-4 py-12 text-white sm:py-16'>
        <div className='pointer-events-none absolute -left-20 top-10 size-64 rounded-full bg-white/10 blur-2xl' />
        <div className='pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-black/10 blur-3xl' />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='max-w-3xl'>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/90'>
              <Shield className='size-3.5' />
              Privacy & Trust
            </span>
            <h1 className='mt-4 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl'>
              Privacy Policy
            </h1>
            <p className='mt-4 flex items-center gap-2 text-sm font-semibold text-white/80 sm:text-base'>
              <Calendar className='size-4 shrink-0' />
              Last updated: June 01, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className='mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:py-16'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-4'>
          {/* Desktop Sticky Index / Sidebar */}
          <aside className='hidden lg:block sticky top-28 self-start h-fit'>
            <div className='flex flex-col gap-1 rounded-2xl border border-border bg-card p-5 shadow-xs'>
              <p className='mb-4 flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                <FileText className='size-4 text-primary' />
                On this page
              </p>
              <nav
                className='flex flex-col gap-1 text-sm font-medium'
                aria-label='Privacy policy index'
              >
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`rounded-lg px-3 py-2 text-left transition ${
                      activeSection === section.id
                        ? 'bg-[#E7000B]/10 font-bold text-[#E7000B]'
                        : 'text-foreground/75 hover:bg-muted/70 hover:text-foreground'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Text Column */}
          <div className='lg:col-span-3'>
            <div className='prose prose-zinc max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:font-black prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-foreground/90'>
              {/* Introduction */}
              <section
                id='introduction'
                className='scroll-mt-28 border-b border-border pb-10'
              >
                <p className='text-lg leading-relaxed text-foreground/80 sm:text-xl'>
                  This Privacy Policy describes Our policies and procedures on
                  the collection, use and disclosure of Your information when
                  You use the Service and tells You about Your privacy rights
                  and how the law protects You.
                </p>
                <p className='mt-4'>
                  We use Your Personal Data to provide and improve the Service.
                  By using the Service, You agree to the collection and use of
                  information in accordance with this Privacy Policy. This
                  Privacy Policy has been created with the help of the{' '}
                  <a
                    href='https://www.termsfeed.com/privacy-policy-generator/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-primary underline hover:text-primary/80'
                  >
                    Privacy Policy Generator
                  </a>
                  .
                </p>
              </section>

              {/* Interpretation and Definitions */}
              <section
                id='definitions'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Interpretation and Definitions
                </h2>

                <h3 className='mt-6 font-display text-lg font-bold text-foreground'>
                  Interpretation
                </h3>
                <p className='mt-2'>
                  The words whose initial letters are capitalized have meanings
                  defined under the following conditions. The following
                  definitions shall have the same meaning regardless of whether
                  they appear in singular or in plural.
                </p>

                <h3 className='mt-8 font-display text-lg font-bold text-foreground'>
                  Definitions
                </h3>
                <p className='mt-2 text-muted-foreground text-sm'>
                  For the purposes of this Privacy Policy:
                </p>

                {/* Custom definitions grid cards for maximum style and readability */}
                <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Account</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Means a unique account created for You to access our
                      Service or parts of our Service.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Affiliate</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Means an entity that controls, is controlled by, or is
                      under common control with a party, where "control" means
                      ownership of 50% or more of the shares, equity interest or
                      other securities entitled to vote for election of
                      directors or other managing authority.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Application</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Refers to{' '}
                      <strong className='text-foreground'>
                        Matha chickens
                      </strong>
                      , the software program provided by the Company.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Company</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Refers to{' '}
                      <strong className='text-foreground'>
                        Matha Chickens
                      </strong>
                      , located at Barkur Road, Barkur, Udupi, Karnataka, India
                      - 576210.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Country</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Refers to: Karnataka, India.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Device</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Means any device that can access the Service such as a
                      computer, a cell phone or a digital tablet.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Personal Data</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Is any information that relates to an identified or
                      identifiable individual. We use "Personal Data" and
                      "Personal Information" interchangeably.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Service</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Refers to the Application.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Service Provider</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Means any natural or legal person who processes the data
                      on behalf of the Company, including third-party companies
                      or individuals hired to facilitate, provide, or analyse
                      the Service.
                    </p>
                  </div>

                  <div className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30'>
                    <p className='font-bold text-primary'>Usage Data</p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Refers to data collected automatically, either generated
                      by the use of the Service or from the Service
                      infrastructure itself (e.g. page visit duration).
                    </p>
                  </div>
                </div>

                <div className='mt-4 rounded-xl border border-border/85 bg-card p-4 shadow-2xs hover:border-primary/30 sm:col-span-2'>
                  <p className='font-bold text-primary'>You</p>
                  <p className='mt-1 text-sm text-foreground/80'>
                    Means the individual accessing or using the Service, or the
                    company, or other legal entity on behalf of which such
                    individual is accessing or using the Service, as applicable.
                  </p>
                </div>
              </section>

              {/* Collecting and Using Your Personal Data */}
              <section
                id='collecting-data'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Collecting and Using Your Personal Data
                </h2>

                <h3 className='mt-6 font-display text-lg font-bold text-foreground'>
                  Types of Data Collected
                </h3>

                <h4 className='mt-4 font-bold text-[#E7000B] uppercase tracking-wider text-xs'>
                  Personal Data
                </h4>
                <p className='mt-2'>
                  While using Our Service, We may ask You to provide Us with
                  certain personally identifiable information that can be used
                  to contact or identify You. Personally identifiable
                  information may include, but is not limited to:
                </p>
                <ul className='mt-3 list-disc pl-6 space-y-1'>
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                </ul>

                <h4 className='mt-6 font-bold text-[#E7000B] uppercase tracking-wider text-xs'>
                  Usage Data
                </h4>
                <p className='mt-2'>
                  Usage Data is collected automatically when using the Service.
                </p>
                <p className='mt-2'>
                  Usage Data may include information such as Your Device's
                  Internet Protocol address (e.g. IP address), browser type,
                  browser version, the pages of our Service that You visit, the
                  time and date of Your visit, the time spent on those pages,
                  unique device identifiers and other diagnostic data.
                </p>
                <p className='mt-2'>
                  When You access the Service by or through a mobile device, We
                  may collect certain information automatically, including, but
                  not limited to, the type of mobile device You use, Your mobile
                  device's unique ID, the IP address of Your mobile device, Your
                  mobile operating system, the type of mobile Internet browser
                  You use, unique device identifiers and other diagnostic data.
                </p>
                <p className='mt-2'>
                  We may also collect information that Your browser sends
                  whenever You visit Our Service or when You access the Service
                  by or through a mobile device.
                </p>

                <h4 className='mt-6 font-bold text-[#E7000B] uppercase tracking-wider text-xs'>
                  Information Collected while Using the Application
                </h4>
                <p className='mt-2 font-medium'>
                  While using Our Application, in order to provide features of
                  Our Application, We may collect, with Your prior permission:
                </p>
                <ul className='mt-3 list-disc pl-6 space-y-1'>
                  <li>
                    <strong>Information regarding your location:</strong> We use
                    this location data to provide and customize local store
                    delivery and availability features. The information may be
                    uploaded to the Company's servers and/or a Service
                    Provider's server or it may be simply stored on Your device.
                  </li>
                </ul>
                <div className='mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-800 dark:text-yellow-200'>
                  You can enable or disable access to your location details at
                  any time through Your Device settings.
                </div>
              </section>

              {/* Use of Your Personal Data */}
              <section
                id='use-of-data'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Use of Your Personal Data
                </h2>
                <p className='mt-2'>
                  The Company may use Personal Data for the following purposes:
                </p>

                <div className='mt-6 space-y-4'>
                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>
                      To provide and maintain our Service
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Including to monitor the usage of our Service.
                    </p>
                  </div>

                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>
                      To manage Your Account
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      To manage Your registration as a user of the Service. The
                      Personal Data You provide can give You access to different
                      functionalities of the Service that are available to You
                      as a registered user.
                    </p>
                  </div>

                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>
                      For the performance of a contract
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      The development, compliance and undertaking of the
                      purchase contract for the products, items or services You
                      have purchased or of any other contract with Us through
                      the Service.
                    </p>
                  </div>

                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>To contact You</p>
                    <p className='text-sm text-muted-foreground'>
                      To contact You by email, telephone calls, SMS, or other
                      equivalent forms of electronic communication, such as push
                      notifications regarding updates or informative
                      communications related to products, services, and security
                      updates.
                    </p>
                  </div>

                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>
                      To provide You with news and special offers
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      General information about other goods, services and events
                      which We offer that are similar to those that you have
                      already purchased or inquired about unless You have opted
                      not to receive such information.
                    </p>
                  </div>

                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>
                      To manage Your requests
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      To attend and manage Your requests to Us.
                    </p>
                  </div>

                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>
                      For business transfers
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      To evaluate or conduct a merger, divestiture,
                      restructuring, reorganization, dissolution, or other sale
                      or transfer of assets, in which Personal Data held by Us
                      is among the assets transferred.
                    </p>
                  </div>

                  <div className='border-l-4 border-primary pl-4'>
                    <p className='font-bold text-foreground'>
                      For other purposes
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      For data analysis, identifying usage trends, determining
                      the effectiveness of our promotional campaigns and to
                      evaluate and improve our Service, products, services,
                      marketing and your experience.
                    </p>
                  </div>
                </div>

                <p className='mt-8 font-semibold'>
                  We may share Your Personal Data in the following situations:
                </p>
                <ul className='mt-3 list-disc pl-6 space-y-2'>
                  <li>
                    <strong>With Service Providers:</strong> To monitor and
                    analyze the use of our Service, and to contact You.
                  </li>
                  <li>
                    <strong>For business transfers:</strong> In connection with,
                    or during negotiations of, any merger, sale of Company
                    assets, financing, or acquisition of all or a portion of Our
                    business.
                  </li>
                  <li>
                    <strong>With Affiliates:</strong> In which case we will
                    require those affiliates to honor this Privacy Policy
                    (including our parent company and subsidiaries).
                  </li>
                  <li>
                    <strong>With business partners:</strong> To offer You
                    certain products, services or promotions.
                  </li>
                  <li>
                    <strong>With other users:</strong> When you share personal
                    information or interact in public areas, such information
                    may be viewed by all users and may be publicly distributed
                    outside.
                  </li>
                  <li>
                    <strong>With Your consent:</strong> We may disclose Your
                    Personal Data for any other purpose with Your consent.
                  </li>
                </ul>
              </section>

              {/* Retention of Your Personal Data */}
              <section
                id='retention'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Retention of Your Personal Data
                </h2>
                <p className='mt-2'>
                  The Company will retain Your Personal Data only for as long as
                  is necessary for the purposes set out in this Privacy Policy.
                  We will retain and use Your Personal Data to the extent
                  necessary to comply with our legal obligations (for example,
                  if We are required to retain Your data to comply with
                  applicable laws), resolve disputes, and enforce our legal
                  agreements and policies.
                </p>
                <p className='mt-2'>
                  Where possible, We apply shorter retention periods and/or
                  reduce identifiability by deleting, aggregating, or
                  anonymizing data. Unless otherwise stated, the retention
                  periods below are maximum periods ("up to") and We may delete
                  or anonymize data sooner when it is no longer needed for the
                  relevant purpose. We apply different retention periods to
                  different categories of Personal Data based on the purpose of
                  processing and legal obligations:
                </p>

                <div className='mt-6 overflow-hidden rounded-xl border border-border shadow-2xs'>
                  <table className='w-full text-left text-sm border-collapse'>
                    <thead>
                      <tr className='bg-muted border-b border-border'>
                        <th className='p-3 font-bold text-foreground'>
                          Category
                        </th>
                        <th className='p-3 font-bold text-foreground'>
                          Maximum Retention Period
                        </th>
                        <th className='p-3 font-bold text-foreground'>
                          Purpose
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border'>
                      <tr>
                        <td className='p-3 font-medium'>User Accounts</td>
                        <td className='p-3'>
                          Duration of account relationship plus up to 24 months
                        </td>
                        <td className='p-3'>
                          To handle post-termination issues or resolve disputes.
                        </td>
                      </tr>
                      <tr>
                        <td className='p-3 font-medium'>
                          Customer Support Data
                        </td>
                        <td className='p-3'>
                          Up to 24 months from ticket closure
                        </td>
                        <td className='p-3'>
                          To resolve follow-up inquiries, track quality, and
                          defend claims.
                        </td>
                      </tr>
                      <tr>
                        <td className='p-3 font-medium'>Chat transcripts</td>
                        <td className='p-3'>Up to 24 months</td>
                        <td className='p-3'>
                          Quality assurance and staff training purposes.
                        </td>
                      </tr>
                      <tr>
                        <td className='p-3 font-medium'>
                          Application usage stats
                        </td>
                        <td className='p-3'>Up to 24 months</td>
                        <td className='p-3'>
                          To understand feature adoption and service
                          improvements.
                        </td>
                      </tr>
                      <tr>
                        <td className='p-3 font-medium'>
                          Server logs (IP, access)
                        </td>
                        <td className='p-3'>Up to 24 months</td>
                        <td className='p-3'>
                          Security monitoring and troubleshooting.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className='mt-6'>
                  We may retain Personal Data beyond the periods stated above
                  for different reasons:
                </p>
                <ul className='list-disc pl-6 space-y-1 mt-2'>
                  <li>
                    <strong>Legal obligation:</strong> We are required by law to
                    retain specific data (e.g. tax records).
                  </li>
                  <li>
                    <strong>Legal claims:</strong> Data is necessary to
                    establish, exercise, or defend legal claims.
                  </li>
                  <li>
                    <strong>Your explicit request:</strong> You ask Us to retain
                    specific information.
                  </li>
                  <li>
                    <strong>Technical limitations:</strong> Data exists in
                    backup systems scheduled for routine deletion.
                  </li>
                </ul>

                <p className='mt-6 font-semibold'>Deletion Procedures:</p>
                <p className='mt-2'>
                  When retention periods expire, We securely delete or anonymize
                  Personal Data:
                </p>
                <ul className='list-disc pl-6 space-y-1 mt-2'>
                  <li>
                    <strong>Deletion:</strong> Personal Data is removed from Our
                    active systems and no longer processed.
                  </li>
                  <li>
                    <strong>Backup retention:</strong> Residual copies in
                    encrypted backups are deleted on a schedule and never
                    restored except for disaster recovery or safety.
                  </li>
                  <li>
                    <strong>Anonymization:</strong> Converting Personal Data
                    into anonymous statistical data that cannot be linked back
                    to You for research and analytics.
                  </li>
                </ul>
              </section>

              {/* Transfer of Your Personal Data */}
              <section
                id='transfer'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Transfer of Your Personal Data
                </h2>
                <p className='mt-2'>
                  Your information, including Personal Data, is processed at the
                  Company's operating offices and in any other places where the
                  parties involved in the processing are located. It means that
                  this information may be transferred to — and maintained on —
                  computers located outside of Your state, province, country or
                  other governmental jurisdiction where the data protection laws
                  may differ from those from Your jurisdiction.
                </p>
                <p className='mt-2'>
                  Where required by applicable law, We will ensure that
                  international transfers of Your Personal Data are subject to
                  appropriate safeguards and supplementary measures where
                  appropriate. The Company will take all steps reasonably
                  necessary to ensure that Your data is treated securely and in
                  accordance with this Privacy Policy and no transfer of Your
                  Personal Data will take place to an organization or a country
                  unless there are adequate controls in place including the
                  security of Your data and other personal information.
                </p>
              </section>

              {/* Delete Your Personal Data */}
              <section
                id='delete-data'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Delete Your Personal Data
                </h2>
                <p className='mt-2'>
                  You have the right to delete or request that We assist in
                  deleting the Personal Data that We have collected about You.
                </p>
                <p className='mt-2'>
                  Our Service may give You the ability to delete certain
                  information about You from within the Service.
                </p>
                <p className='mt-2'>
                  You may update, amend, or delete Your information at any time
                  by signing in to Your Account, if you have one, and visiting
                  the account settings section that allows you to manage Your
                  personal information. You may also contact Us to request
                  access to, correct, or delete any Personal Data that You have
                  provided to Us.
                </p>
                <div className='mt-4 rounded-xl border border-red-500/20 bg-red-50/10 p-4 text-sm text-foreground/80'>
                  Please note, however, that We may need to retain certain
                  information when we have a legal obligation or lawful basis to
                  do so.
                </div>
              </section>

              {/* Disclosure of Your Personal Data */}
              <section
                id='disclosure'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Disclosure of Your Personal Data
                </h2>

                <h3 className='mt-6 font-display text-lg font-bold text-foreground'>
                  Business Transactions
                </h3>
                <p className='mt-2'>
                  If the Company is involved in a merger, acquisition or asset
                  sale, Your Personal Data may be transferred. We will provide
                  notice before Your Personal Data is transferred and becomes
                  subject to a different Privacy Policy.
                </p>

                <h3 className='mt-6 font-display text-lg font-bold text-foreground'>
                  Law enforcement
                </h3>
                <p className='mt-2'>
                  Under certain circumstances, the Company may be required to
                  disclose Your Personal Data if required to do so by law or in
                  response to valid requests by public authorities (e.g. a court
                  or a government agency).
                </p>

                <h3 className='mt-6 font-display text-lg font-bold text-foreground'>
                  Other legal requirements
                </h3>
                <p className='mt-2 font-medium text-foreground'>
                  The Company may disclose Your Personal Data in the good faith
                  belief that such action is necessary to:
                </p>
                <ul className='list-disc pl-6 space-y-1 mt-2'>
                  <li>Comply with a legal obligation</li>
                  <li>
                    Protect and defend the rights or property of the Company
                  </li>
                  <li>
                    Prevent or investigate possible wrongdoing in connection
                    with the Service
                  </li>
                  <li>
                    Protect the personal safety of Users of the Service or the
                    public
                  </li>
                  <li>Protect against legal liability</li>
                </ul>
              </section>

              {/* Security of Your Personal Data */}
              <section
                id='security'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Security of Your Personal Data
                </h2>
                <p className='mt-2'>
                  The security of Your Personal Data is important to Us, but
                  remember that no method of transmission over the Internet, or
                  method of electronic storage is 100% secure. While We strive
                  to use commercially reasonable means to protect Your Personal
                  Data, We cannot guarantee its absolute security.
                </p>
              </section>

              {/* Children's Privacy */}
              <section
                id='children'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Children's Privacy
                </h2>
                <p className='mt-2'>
                  Our Service does not address anyone under the age of 16. We do
                  not knowingly collect personally identifiable information from
                  anyone under the age of 16. If You are a parent or guardian
                  and You are aware that Your child has provided Us with
                  Personal Data, please contact Us. If We become aware that We
                  have collected Personal Data from anyone under the age of 16
                  without verification of parental consent, We take steps to
                  remove that information from Our servers.
                </p>
                <p className='mt-2'>
                  If We need to rely on consent as a legal basis for processing
                  Your information and Your country requires consent from a
                  parent, We may require Your parent's consent before We collect
                  and use that information.
                </p>
              </section>

              {/* Links to Other Websites */}
              <section
                id='external-links'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Links to Other Websites
                </h2>
                <p className='mt-2'>
                  Our Service may contain links to other websites that are not
                  operated by Us. If You click on a third party link, You will
                  be directed to that third party's site. We strongly advise You
                  to review the Privacy Policy of every site You visit.
                </p>
                <p className='mt-2'>
                  We have no control over and assume no responsibility for the
                  content, privacy policies or practices of any third party
                  sites or services.
                </p>
              </section>

              {/* Changes to this Privacy Policy */}
              <section
                id='changes'
                className='scroll-mt-28 border-b border-border py-10'
              >
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Changes to this Privacy Policy
                </h2>
                <p className='mt-2'>
                  We may update Our Privacy Policy from time to time. We will
                  notify You of any changes by posting the new Privacy Policy on
                  this page.
                </p>
                <p className='mt-2'>
                  We will let You know via email and/or a prominent notice on
                  Our Service, prior to the change becoming effective and update
                  the "Last updated" date at the top of this Privacy Policy.
                </p>
                <p className='mt-2'>
                  You are advised to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
              </section>

              {/* Contact Us */}
              <section id='contact-us' className='scroll-mt-28 py-10'>
                <h2 className='font-display text-2xl font-black uppercase text-foreground'>
                  Contact Us
                </h2>
                <p className='mt-2 text-foreground/80'>
                  If you have any questions about this Privacy Policy or our
                  practices, please contact us:
                </p>

                {/* Highly structured contact details cards */}
                <div className='mt-6 grid gap-6 sm:grid-cols-2'>
                  <div className='flex gap-4 rounded-2xl border border-[#E7000B]/15 bg-[#FFF8F8] p-5 shadow-2xs hover:border-[#E7000B]/35'>
                    <span className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#E7000B]/10 text-[#E7000B]'>
                      <Mail className='size-6' />
                    </span>
                    <div className='min-w-0'>
                      <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                        Email Support
                      </p>
                      <a
                        href='mailto:support@mathachickens.com'
                        className='mt-1 block font-bold text-foreground hover:text-primary hover:underline break-words'
                      >
                        support@mathachickens.com
                      </a>
                      <p className='mt-2 text-xs text-muted-foreground'>
                        Typically responds within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-2xs hover:border-primary/20'>
                    <span className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#E7000B]/10 text-[#E7000B]'>
                      <Building className='size-6' />
                    </span>
                    <div className='min-w-0'>
                      <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                        Office Address
                      </p>
                      <div className='mt-1 text-sm font-semibold text-foreground/90'>
                        <p className='font-bold text-foreground'>
                          Matha Chickens
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Building No./Flat No.: 2-68 6 A
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Road/Street: Barkur Road
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          City/Town/Village: Barkur
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          District: Udupi
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          State: Karnataka
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          PIN Code: 576210
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Styled Footer Attribution */}
      <footer className='mt-auto border-t border-border bg-muted py-6 text-center text-xs text-muted-foreground'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <p>
            © {new Date().getFullYear()} Matha Chickens. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
